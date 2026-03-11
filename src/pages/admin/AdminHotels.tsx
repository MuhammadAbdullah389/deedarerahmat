import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MapPin, Building2 } from "lucide-react";
import { mockHotels } from "@/data/mockDashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AdminHotels = () => {
  const [addOpen, setAddOpen] = useState(false);

  const makkahHotels = mockHotels.filter(h => h.city === 'Makkah');
  const madinahHotels = mockHotels.filter(h => h.city === 'Madinah');

  const renderHotelCard = (hotel: typeof mockHotels[0]) => (
    <Card key={hotel.id} className="group hover:shadow-md transition-all border-0 shadow-sm">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">{hotel.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${hotel.city === 'Makkah' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                {hotel.city}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {hotel.distanceMeters}m
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Edit (mock)")}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => toast.info("Delete (mock)")}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Hotel Management</h1>
            <p className="text-muted-foreground text-sm mt-1">{mockHotels.length} hotels registered</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2 shadow-md"><Plus className="h-4 w-4" /> Add Hotel</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Add New Hotel</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Hotel added (mock)"); setAddOpen(false); }}>
                <div className="space-y-2">
                  <Label>Hotel Name</Label>
                  <Input placeholder="e.g. Hilton Suites" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Makkah">Makkah</SelectItem>
                      <SelectItem value="Madinah">Madinah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Distance from Haram (meters)</Label>
                  <Input type="number" placeholder="e.g. 200" />
                </div>
                <Button type="submit" variant="gold" className="w-full">Add Hotel</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="font-display font-semibold text-foreground">Makkah ({makkahHotels.length})</h2>
            </div>
            {makkahHotels.map(renderHotelCard)}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <h2 className="font-display font-semibold text-foreground">Madinah ({madinahHotels.length})</h2>
            </div>
            {madinahHotels.map(renderHotelCard)}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHotels;
