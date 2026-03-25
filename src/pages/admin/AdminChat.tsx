import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, CheckCheck, MessageCircle, Send, Phone, FileText } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabase";
import {
  useAdminChatConversations,
  useChatMessages,
  useMarkConversationMessagesDelivered,
  useMarkConversationMessagesSeen,
  useSendChatMessage,
  useUserBookings,
} from "@/hooks/useSupabase";
import { toast } from "sonner";

const formatTime = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const getOutgoingStatus = (message: { delivered_at: string | null; seen_at: string | null; is_read: boolean }) => {
  if (message.seen_at || message.is_read) return "seen";
  if (message.delivered_at) return "delivered";
  return "sent";
};

const formatDateTime = (isoDate: string) =>
  new Date(isoDate).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const getInitials = (name?: string | null) => {
  if (!name) return "A";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const isChatTableMissingError = (error: any) => {
  const text = `${error?.code || ""} ${error?.message || ""} ${error?.details || ""}`.toLowerCase();
  return text.includes("pgrst205") || text.includes("chat_conversations") || text.includes("schema cache");
};

const AdminChat = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [draftMessage, setDraftMessage] = useState("");
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    data: conversations = [],
    isLoading: loadingConversations,
    error: conversationsError,
  } = useAdminChatConversations();
  const chatUnavailable = isChatTableMissingError(conversationsError);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || null,
    [conversations, activeConversationId],
  );

  const { data: messages = [], isLoading: loadingMessages } = useChatMessages(activeConversationId);
  const sendMessage = useSendChatMessage();
  const markDelivered = useMarkConversationMessagesDelivered();
  const markSeen = useMarkConversationMessagesSeen();

  const { data: userBookings = [], isLoading: loadingBookings } = useUserBookings(
    activeConversation?.user_id || "",
  );

  const hasUndeliveredUserMessages = useMemo(
    () => messages.some((message) => message.sender_role === "user" && !message.is_read && !message.delivered_at),
    [messages],
  );

  const hasUnseenUserMessages = useMemo(
    () => messages.some((message) => message.sender_role === "user" && !message.is_read && !message.seen_at),
    [messages],
  );

  useEffect(() => {
    if (activeConversationId) return;
    if (!conversations.length) return;

    setActiveConversationId(conversations[0].id);
  }, [conversations, activeConversationId]);

  useEffect(() => {
    if (!activeConversationId || !hasUndeliveredUserMessages || markDelivered.isPending) return;

    markDelivered.mutate({
      conversationId: activeConversationId,
      receiverRole: "admin",
    });
  }, [activeConversationId, hasUndeliveredUserMessages, markDelivered, markDelivered.isPending]);

  useEffect(() => {
    if (!activeConversationId || hasUndeliveredUserMessages || !hasUnseenUserMessages || markSeen.isPending) return;

    markSeen.mutate({
      conversationId: activeConversationId,
      readerRole: "admin",
    });
  }, [activeConversationId, hasUndeliveredUserMessages, hasUnseenUserMessages, markSeen, markSeen.isPending]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-chat-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_conversations" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["admin-chat-conversations"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages" },
        () => {
          if (activeConversationId) {
            queryClient.invalidateQueries({ queryKey: ["chat-messages", activeConversationId] });
          }
          queryClient.invalidateQueries({ queryKey: ["admin-chat-conversations"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();

    if (!user?.id || !activeConversationId) return;
    const message = draftMessage.trim();
    if (!message) return;

    sendMessage.mutate(
      {
        conversationId: activeConversationId,
        senderId: user.id,
        senderRole: "admin",
        messageText: message,
      },
      {
        onSuccess: () => {
          setDraftMessage("");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to send message");
        },
      },
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Applicant Support Center</h1>
              <p className="text-xs text-muted-foreground">Manage all applicant inquiries</p>
            </div>
          </div>
          <Badge variant="default" className="gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Realtime
          </Badge>
        </div>

        {chatUnavailable && (
          <Alert>
            <AlertTitle>Chat is not available yet</AlertTitle>
            <AlertDescription>
              The chat database migration is not applied on Supabase. Please run the latest migration and refresh.
            </AlertDescription>
          </Alert>
        )}

        {!chatUnavailable && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[74vh]">
            <Card className="lg:col-span-1 h-full shadow-lg border-0">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <CardTitle className="text-base">Active Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(74vh-73px)]">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-2">
                    {loadingConversations ? (
                      <div className="space-y-2 p-2">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : conversations.length === 0 ? (
                      <div className="text-sm text-muted-foreground p-4 text-center">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No applicant messages yet</p>
                      </div>
                    ) : (
                      conversations.map((conversation) => {
                        const isActive = conversation.id === activeConversationId;
                        const userName = conversation.profile?.full_name || "Applicant";

                        return (
                          <button
                            key={conversation.id}
                            type="button"
                            className={`w-full text-left rounded-lg border p-3 transition-all hover:shadow-md ${
                              isActive
                                ? "border-primary bg-primary/5 shadow-md"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                            onClick={() => setActiveConversationId(conversation.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.user_id}`}
                                />
                                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                                  {!!conversation.unread_count && conversation.unread_count > 0 && (
                                    <Badge className="text-xs shrink-0">{conversation.unread_count}</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {conversation.last_message_preview || "No messages yet"}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                  {formatDateTime(conversation.last_message_at)}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 h-full flex flex-col shadow-lg border-0">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-50 dark:from-slate-900 dark:to-slate-800">
                {activeConversation ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.user_id}`}
                          />
                          <AvatarFallback>{getInitials(activeConversation.profile?.full_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-base">{activeConversation.profile?.full_name || "Applicant"}</CardTitle>
                          <div className="flex flex-col gap-1 mt-1">
                            {activeConversation.profile?.phone && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {activeConversation.profile.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBookingsModal(true)}
                        className="gap-2 shrink-0"
                      >
                        <FileText className="w-4 h-4" />
                        Bookings
                      </Button>
                      {!!activeConversation.unread_count && activeConversation.unread_count > 0 && (
                        <Badge className="text-xs">{activeConversation.unread_count} unread</Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <CardTitle className="text-base">Select a conversation to start</CardTitle>
                )}
              </CardHeader>
              <CardContent className="p-0 flex-1 min-h-0 flex flex-col">
                {!activeConversation ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Select a conversation from the left panel</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="h-[calc(74vh-205px)] px-4 py-4">
                      <div className="space-y-3">
                        {loadingMessages ? (
                          <div className="space-y-2">
                            <Skeleton className="h-16 w-2/3" />
                            <Skeleton className="h-16 w-2/3 ml-auto" />
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="text-center text-sm text-muted-foreground py-10">
                            No messages in this conversation yet.
                          </div>
                        ) : (
                          messages.map((message) => {
                            const own = message.sender_role === "admin";
                            const status = own ? getOutgoingStatus(message) : null;

                            return (
                              <div key={message.id} className={`flex gap-2 ${own ? "flex-row-reverse" : "flex-row"}`}>
                                <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                                  <AvatarImage
                                    src={
                                      own
                                        ? "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                                        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.user_id}`
                                    }
                                  />
                                  <AvatarFallback>{own ? "A" : "U"}</AvatarFallback>
                                </Avatar>
                                <div className={`flex flex-col gap-1 max-w-[70%] ${own ? "items-end" : "items-start"}`}>
                                  <div
                                    className={`rounded-2xl px-4 py-2 text-sm ${
                                      own
                                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-sm"
                                        : "bg-slate-100 dark:bg-slate-800 text-foreground border"
                                    }`}
                                  >
                                    <p className="whitespace-pre-wrap leading-relaxed">{message.message_text}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground px-2 inline-flex items-center gap-1">
                                    {formatTime(message.created_at)}
                                    {status === "sent" && <Check className="h-3 w-3" />}
                                    {status === "delivered" && <CheckCheck className="h-3 w-3" />}
                                    {status === "seen" && <CheckCheck className="h-3 w-3 text-sky-500 dark:text-sky-400" />}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={bottomRef} />
                      </div>
                    </ScrollArea>

                    <form onSubmit={handleSend} className="border-t bg-slate-50 dark:bg-slate-900 p-4 flex flex-col gap-3">
                      <div className="flex gap-3">
                        <Textarea
                          value={draftMessage}
                          onChange={(event) => setDraftMessage(event.target.value)}
                          placeholder="Reply to applicant..."
                          className="min-h-20 resize-none"
                        />
                        <Button
                          type="submit"
                          disabled={sendMessage.isPending || !draftMessage.trim()}
                          size="lg"
                          className="shrink-0 gap-2"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Press Shift+Enter for new line</p>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bookings Modal */}
        <Dialog open={showBookingsModal} onOpenChange={setShowBookingsModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {activeConversation?.profile?.full_name || "Applicant"} - Bookings
              </DialogTitle>
              <DialogDescription>All booking records for this applicant</DialogDescription>
            </DialogHeader>

            {loadingBookings ? (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : userBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No bookings found for this applicant</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 space-y-2 bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">{booking.booking_code}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {booking.package_name_snapshot || booking.package_type}
                        </p>
                      </div>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Package Type</p>
                        <p className="font-medium capitalize">{booking.package_type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          {booking.amount_pkr ? `PKR ${booking.amount_pkr.toLocaleString()}` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Travel Date</p>
                        <p className="font-medium">
                          {booking.travel_date
                            ? new Date(booking.travel_date).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sharing</p>
                        <p className="font-medium capitalize">{booking.sharing_type || "N/A"}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      Created {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
