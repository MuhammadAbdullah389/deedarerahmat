import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, MessageCircle, Send } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabase";
import {
  useChatMessages,
  useEnsureUserChatConversation,
  useMarkConversationMessagesDelivered,
  useMarkConversationMessagesSeen,
  useSendChatMessage,
  useUserChatConversation,
} from "@/hooks/useSupabase";
import { toast } from "sonner";

const formatTime = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const getOutgoingStatus = (message: { delivered_at: string | null; seen_at: string | null; is_read: boolean }) => {
  if (message.seen_at || message.is_read) return "seen";
  if (message.delivered_at) return "delivered";
  return "sent";
};

const getInitials = (name?: string | null) => {
  if (!name) return "U";
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

const UserChat = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [draftMessage, setDraftMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    data: conversation,
    isLoading: conversationLoading,
    error: conversationError,
  } = useUserChatConversation(user?.id || "");
  const ensureConversation = useEnsureUserChatConversation();
  const sendMessage = useSendChatMessage();
  const markDelivered = useMarkConversationMessagesDelivered();
  const markSeen = useMarkConversationMessagesSeen();

  const conversationId = conversation?.id || "";
  const { data: messages = [], isLoading: messagesLoading } = useChatMessages(conversationId);

  const hasUndeliveredAdminMessages = useMemo(
    () => messages.some((message) => message.sender_role === "admin" && !message.is_read && !message.delivered_at),
    [messages],
  );

  const hasUnseenAdminMessages = useMemo(
    () => messages.some((message) => message.sender_role === "admin" && !message.is_read && !message.seen_at),
    [messages],
  );

  const chatUnavailable = isChatTableMissingError(conversationError);

  useEffect(() => {
    if (!user?.id) return;
    if (conversationLoading) return;
    if (conversation) return;
    if (conversationError) return;
    if (ensureConversation.isPending) return;

    ensureConversation.mutate(user.id, {
      onError: (error: any) => {
        toast.error(error?.message || "Unable to start chat");
      },
    });
  }, [user?.id, conversationLoading, conversation, conversationError, ensureConversation]);

  useEffect(() => {
    if (!conversationId || !hasUndeliveredAdminMessages || markDelivered.isPending) return;

    markDelivered.mutate({
      conversationId,
      receiverRole: "user",
    });
  }, [conversationId, hasUndeliveredAdminMessages, markDelivered, markDelivered.isPending]);

  useEffect(() => {
    if (!conversationId || hasUndeliveredAdminMessages || !hasUnseenAdminMessages || markSeen.isPending) return;

    markSeen.mutate({
      conversationId,
      readerRole: "user",
    });
  }, [conversationId, hasUndeliveredAdminMessages, hasUnseenAdminMessages, markSeen, markSeen.isPending]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`user-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["chat-messages", conversationId] });
          queryClient.invalidateQueries({ queryKey: ["admin-chat-conversations"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();

    if (!user?.id || !conversationId) return;

    const message = draftMessage.trim();
    if (!message) return;

    sendMessage.mutate(
      {
        conversationId,
        senderId: user.id,
        senderRole: "user",
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
    <UserLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                <MessageCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">Live Support Chat</h1>
                <p className="text-xs text-muted-foreground">Our team responds during business hours</p>
              </div>
            </div>
            <Badge variant="default" className="gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Connected
            </Badge>
          </div>
        </div>

        <Card className="h-[70vh] flex flex-col shadow-lg border-0">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Messages</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Chat with our support team</p>
              </div>
              <Badge variant="outline">Support Active</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 min-h-0 p-0">
            {chatUnavailable && (
              <div className="p-4">
                <Alert>
                  <AlertTitle>Chat is not available yet</AlertTitle>
                  <AlertDescription>
                    The chat database migration is not applied on Supabase. Please run the latest migration and refresh.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {!chatUnavailable && (conversationLoading || (ensureConversation.isPending && !conversationId)) ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-2/3 ml-auto" />
                <Skeleton className="h-16 w-3/4" />
              </div>
            ) : !chatUnavailable ? (
              <>
                <ScrollArea className="h-[calc(70vh-165px)] px-4 py-4">
                  <div className="space-y-3">
                    {messagesLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-16 w-2/3" />
                        <Skeleton className="h-16 w-1/2 ml-auto" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-16">
                        <div className="mb-3 flex justify-center">
                          <div className="p-3 bg-muted rounded-lg">
                            <MessageCircle className="w-6 h-6 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-sm font-medium">No messages yet</p>
                        <p className="text-xs mt-1">Start by sending a message below</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const own = message.sender_role === "user";
                        const status = own ? getOutgoingStatus(message) : null;

                        return (
                          <div key={message.id} className={`flex gap-2 ${own ? "flex-row-reverse" : "flex-row"}`}>
                            <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                              <AvatarImage src={own ? undefined : "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"} />
                              <AvatarFallback className={own ? "bg-primary text-primary-foreground" : "bg-slate-200"}>
                                {own ? "Y" : "A"}
                              </AvatarFallback>
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
                      placeholder="Type your message here..."
                      className="min-h-20 resize-none"
                    />
                    <Button
                      type="submit"
                      disabled={sendMessage.isPending || !draftMessage.trim() || !conversationId}
                      size="lg"
                      className="shrink-0 gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Press Shift+Enter for new line</p>
                </form>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserChat;
