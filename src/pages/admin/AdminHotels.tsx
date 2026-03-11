import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useCreateHotel, useDeleteHotel, useHotels, useUpdateHotel } from "@/hooks/useSupabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AdminHotels = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState<"Makkah" | "Madinah" | "Aziziya" | "">("");
  const [distance, setDistance] = useState("");
  const { data: hotels, isLoading } = useHotels();
  const { mutate: createHotel, isPending: isCreating } = useCreateHotel();
  const { mutate: deleteHotel, isPending: isDeleting } = useDeleteHotel();
  const { mutate: updateHotel, isPending: isUpdating } = useUpdateHotel();

  const clearForm = () => {
    setName("");
    setCity("");
    setDistance("");
    setEditingHotelId(null);
  };

  const handleAddHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !distance) {
      toast.error("Please fill all fields");
      return;
    }

    if (editingHotelId) {
      updateHotel(
        {
          id: editingHotelId,
          name,
          city,
          distance_meters: Number(distance),
        },
        {
          onSuccess: () => {
            toast.success("Hotel updated successfully");
            clearForm();
            setAddOpen(false);
          },
          onError: () => toast.error("Failed to update hotel"),
        }
      );
      return;
    }

    createHotel(
      {
        name,
        city,
        distance_meters: Number(distance),
        active: true,
      },
      {
        onSuccess: () => {
          toast.success("Hotel added successfully");
          clearForm();
          setAddOpen(false);
        },
        onError: () => toast.error("Failed to add hotel"),
      }
    );
  };

  const handleDeleteHotel = (hotelId: string) => {
    deleteHotel(hotelId, {
      onSuccess: () => toast.success("Hotel deleted"),
      onError: () => toast.error("Failed to delete hotel"),
    });
  };

  const handleEditHotel = (hotel: { id: string; name: string; city: "Makkah" | "Madinah" | "Aziziya"; distance_meters: number }) => {
    setEditingHotelId(hotel.id);
    setName(hotel.name);
    setCity(hotel.city);
    setDistance(String(hotel.distance_meters));
    setAddOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Hotel Management</h1>
          <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) clearForm(); }}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2"><Plus className="h-4 w-4" /> Add Hotel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">{editingHotelId ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleAddHotel}>
                <div className="space-y-2">
                  <Label>Hotel Name</Label>
                  <Input placeholder="e.g. Hilton Suites" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={city} onValueChange={(value) => setCity(value as "Makkah" | "Madinah" | "Aziziya")}>
                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Makkah">Makkah</SelectItem>
                      <SelectItem value="Madinah">Madinah</SelectItem>
                      <SelectItem value="Aziziya">Aziziya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Distance from Haram (meters)</Label>
                  <Input type="number" placeholder="e.g. 200" value={distance} onChange={(e) => setDistance(e.target.value)} />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={isCreating || isUpdating}>
                  {editingHotelId ? "Update Hotel" : "Add Hotel"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                      </TableRow>
                    ))
                  : (hotels || []).map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-medium">{hotel.name}</TableCell>
                    <TableCell>
                      <Badge variant={hotel.city === 'Makkah' ? 'default' : 'secondary'}>
                        {hotel.city}
                      </Badge>
                    </TableCell>
                    <TableCell>{hotel.distance_meters}m from Haram</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEditHotel(hotel)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteHotel(hotel.id)} disabled={isDeleting}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminHotels;
