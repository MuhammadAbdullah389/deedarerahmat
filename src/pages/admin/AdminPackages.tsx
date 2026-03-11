import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatPrice, type PackageType } from "@/data/packages";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminPackages, useCreatePackage, useDeletePackage, useHotels, useUpdatePackage } from "@/hooks/useSupabase";
import { toast } from "sonner";

const AdminPackages = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "hajj" as "hajj" | "umrah",
    duration: "",
    description: "",
    featured: false,
    nightBreakdown: "",
    double: "",
    triple: "",
    quad: "",
    quint: "",
    makkahHotelId: "",
    madinahHotelId: "",
    flightRoute: "",
    flightDate: "",
    flightNo: "",
    flightDeparture: "",
    flightArrival: "",
    returnRoute: "",
    returnDate: "",
    returnFlightNo: "",
    returnDeparture: "",
    returnArrival: "",
    itineraryText: "",
    packageDetailsText: "",
    requirementsText: "",
    notesText: "",
    overseasDiscount: "",
  });
  const { data: hajjPackages, isLoading: hajjLoading } = useAdminPackages("hajj");
  const { data: umrahPackages, isLoading: umrahLoading } = useAdminPackages("umrah");
  const { data: hotels } = useHotels();
  const { mutate: createPackage, isPending: isCreating } = useCreatePackage();
  const { mutate: deletePackage, isPending: isDeleting } = useDeletePackage();
  const { mutate: updatePackage, isPending: isUpdating } = useUpdatePackage();

  const resetForm = () => {
    setForm({
      name: "",
      type: "hajj",
      duration: "",
      description: "",
      featured: false,
      nightBreakdown: "",
      double: "",
      triple: "",
      quad: "",
      quint: "",
      makkahHotelId: "",
      madinahHotelId: "",
      flightRoute: "",
      flightDate: "",
      flightNo: "",
      flightDeparture: "",
      flightArrival: "",
      returnRoute: "",
      returnDate: "",
      returnFlightNo: "",
      returnDeparture: "",
      returnArrival: "",
      itineraryText: "",
      packageDetailsText: "",
      requirementsText: "",
      notesText: "",
      overseasDiscount: "",
    });
  };

  const linesToArray = (text: string) =>
    text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const parseItinerary = (text: string) =>
    linesToArray(text).map((line) => {
      const [label = "", dates = "", islamicDate = "", duration = ""] = line.split("|").map((p) => p.trim());
      return { label, dates, islamicDate, duration: duration || undefined };
    });

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.duration || !form.type) {
      toast.error("Please fill required package fields");
      return;
    }

    createPackage(
      {
        name: form.name,
        type: form.type,
        duration_text: form.duration,
        description: form.description,
        featured: form.featured,
        flight_info: {
          route: form.flightRoute,
          date: form.flightDate,
          flight: form.flightNo || undefined,
          departure: form.flightDeparture || undefined,
          arrival: form.flightArrival || undefined,
        },
        return_flight_info: {
          route: form.returnRoute,
          date: form.returnDate,
          flight: form.returnFlightNo || undefined,
          departure: form.returnDeparture || undefined,
          arrival: form.returnArrival || undefined,
        },
        itinerary: parseItinerary(form.itineraryText),
        package_details: [
          ...linesToArray(form.packageDetailsText),
          ...(form.type === "umrah" && form.nightBreakdown.trim()
            ? [`Nights Breakup: ${form.nightBreakdown.trim()}`]
            : []),
        ],
        requirements: linesToArray(form.requirementsText),
        notes: linesToArray(form.notesText),
        overseas_discount: form.type === "hajj" ? form.overseasDiscount || null : null,
        prices: {
          double: form.double ? Number(form.double) : undefined,
          triple: form.triple ? Number(form.triple) : undefined,
          quad: form.quad ? Number(form.quad) : undefined,
          quint: form.quint ? Number(form.quint) : undefined,
        },
        hotel_ids: [form.makkahHotelId, form.madinahHotelId].filter(Boolean),
      },
      {
        onSuccess: () => {
          toast.success("Package created successfully");
          setAddOpen(false);
          resetForm();
        },
        onError: () => toast.error("Failed to create package"),
      }
    );
  };

  const handleDeletePackage = (id: string) => {
    deletePackage(id, {
      onSuccess: () => toast.success("Package deleted"),
      onError: () => toast.error("Failed to delete package"),
    });
  };

  const handleToggleFeatured = (pkg: PackageType) => {
    updatePackage(
      { id: pkg.id, featured: !pkg.featured },
      {
        onSuccess: () => toast.success(`Package marked as ${!pkg.featured ? "featured" : "normal"}`),
        onError: () => toast.error("Failed to update package"),
      }
    );
  };

  const renderTable = (packages: PackageType[] | undefined, isLoading: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Double</TableHead>
          <TableHead>Triple</TableHead>
          <TableHead className="hidden md:table-cell">Quad</TableHead>
          <TableHead className="hidden md:table-cell">Quint</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell>
              </TableRow>
            ))
          : (packages || []).map((pkg) => (
          <TableRow key={pkg.id}>
            <TableCell className="font-medium">
              {pkg.name}
              {pkg.featured && <Badge className="ml-2 bg-accent text-accent-foreground">Featured</Badge>}
            </TableCell>
            <TableCell>{pkg.duration}</TableCell>
            <TableCell>{formatPrice(pkg.prices.double)}</TableCell>
            <TableCell>{formatPrice(pkg.prices.triple)}</TableCell>
            <TableCell className="hidden md:table-cell">{formatPrice(pkg.prices.quad)}</TableCell>
            <TableCell className="hidden md:table-cell">{formatPrice(pkg.prices.quint)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => handleToggleFeatured(pkg)} disabled={isUpdating}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeletePackage(pkg.id)} disabled={isDeleting}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Package Management</h1>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2"><Plus className="h-4 w-4" /> Add Package</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">Add New Package</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleCreatePackage}>
                <div className="space-y-2">
                  <Label>Package Name</Label>
                  <Input placeholder="e.g. Premium Hajj Package" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as "hajj" | "umrah" }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="hajj">Hajj</SelectItem><SelectItem value="umrah">Umrah</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input placeholder="e.g. 21 Days" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Package description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label className="block">Featured</Label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
                      Mark as featured
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Price (Double)</Label><Input type="number" placeholder="0" value={form.double} onChange={(e) => setForm((p) => ({ ...p, double: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Price (Triple)</Label><Input type="number" placeholder="0" value={form.triple} onChange={(e) => setForm((p) => ({ ...p, triple: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Price (Quad)</Label><Input type="number" placeholder="0" value={form.quad} onChange={(e) => setForm((p) => ({ ...p, quad: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Price (Quint)</Label><Input type="number" placeholder="0" value={form.quint} onChange={(e) => setForm((p) => ({ ...p, quint: e.target.value }))} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Makkah Hotel</Label>
                  <Select value={form.makkahHotelId} onValueChange={(v) => setForm((p) => ({ ...p, makkahHotelId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select Hotel" /></SelectTrigger>
                    <SelectContent>
                      {(hotels || []).filter(h => h.city === 'Makkah').map(h => (
                        <SelectItem key={h.id} value={h.id}>{h.name} ({h.distance_meters}m)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Madinah Hotel</Label>
                  <Select value={form.madinahHotelId} onValueChange={(v) => setForm((p) => ({ ...p, madinahHotelId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select Hotel" /></SelectTrigger>
                    <SelectContent>
                      {(hotels || []).filter(h => h.city === 'Madinah').map(h => (
                        <SelectItem key={h.id} value={h.id}>{h.name} ({h.distance_meters}m)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Outbound Route</Label><Input placeholder="ISB → MED" value={form.flightRoute} onChange={(e) => setForm((p) => ({ ...p, flightRoute: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Outbound Date</Label><Input placeholder="23 May" value={form.flightDate} onChange={(e) => setForm((p) => ({ ...p, flightDate: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Outbound Flight #</Label><Input placeholder="SV 723" value={form.flightNo} onChange={(e) => setForm((p) => ({ ...p, flightNo: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Outbound Time (Dep/Arr)</Label><Input placeholder="10:40 / 14:35" value={`${form.flightDeparture}${form.flightArrival ? ` / ${form.flightArrival}` : ''}`} onChange={(e) => {
                    const [dep = '', arr = ''] = e.target.value.split('/').map(s => s.trim());
                    setForm((p) => ({ ...p, flightDeparture: dep, flightArrival: arr }));
                  }} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Return Route</Label><Input placeholder="JED → ISB" value={form.returnRoute} onChange={(e) => setForm((p) => ({ ...p, returnRoute: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Return Date</Label><Input placeholder="11 June" value={form.returnDate} onChange={(e) => setForm((p) => ({ ...p, returnDate: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Return Flight #</Label><Input placeholder="SV 726" value={form.returnFlightNo} onChange={(e) => setForm((p) => ({ ...p, returnFlightNo: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Return Time (Dep/Arr)</Label><Input placeholder="17:40 / 00:20" value={`${form.returnDeparture}${form.returnArrival ? ` / ${form.returnArrival}` : ''}`} onChange={(e) => {
                    const [dep = '', arr = ''] = e.target.value.split('/').map(s => s.trim());
                    setForm((p) => ({ ...p, returnDeparture: dep, returnArrival: arr }));
                  }} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Itinerary (one per line: label|dates|islamicDate|duration)</Label>
                  <Textarea rows={5} placeholder="Flight|23 May|25 ZQ 1446 H|ISB → MED" value={form.itineraryText} onChange={(e) => setForm((p) => ({ ...p, itineraryText: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Package Details (one per line)</Label>
                  <Textarea rows={4} value={form.packageDetailsText} onChange={(e) => setForm((p) => ({ ...p, packageDetailsText: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Requirements (one per line)</Label>
                  <Textarea rows={4} value={form.requirementsText} onChange={(e) => setForm((p) => ({ ...p, requirementsText: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Notes (one per line)</Label>
                  <Textarea rows={3} value={form.notesText} onChange={(e) => setForm((p) => ({ ...p, notesText: e.target.value }))} />
                </div>
                {form.type === "hajj" ? (
                  <div className="space-y-2">
                    <Label>Overseas Discount</Label>
                    <Input placeholder="Less Rs. 300,000 for overseas Hujjaj" value={form.overseasDiscount} onChange={(e) => setForm((p) => ({ ...p, overseasDiscount: e.target.value }))} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Nights Breakdown</Label>
                    <Input placeholder="e.g. 6 - 8 - 6" value={form.nightBreakdown} onChange={(e) => setForm((p) => ({ ...p, nightBreakdown: e.target.value }))} />
                  </div>
                )}
                <Button type="submit" variant="gold" className="w-full" disabled={isCreating}>Create Package</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="hajj">
          <TabsList>
            <TabsTrigger value="hajj">Hajj Packages</TabsTrigger>
            <TabsTrigger value="umrah">Umrah Packages</TabsTrigger>
          </TabsList>
          <TabsContent value="hajj">
            <Card><CardContent className="p-0">{renderTable(hajjPackages, hajjLoading)}</CardContent></Card>
          </TabsContent>
          <TabsContent value="umrah">
            <Card><CardContent className="p-0">{renderTable(umrahPackages, umrahLoading)}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPackages;
