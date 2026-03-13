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
    maktab: "",
    nightBreakdown: "",
    childWithoutBed: "",
    infant: "",
    includedText: "",
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
      maktab: "",
      nightBreakdown: "",
      childWithoutBed: "",
      infant: "",
      includedText: "",
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
          ...(form.type === "hajj" && form.maktab.trim() ? [`Maktab: ${form.maktab.trim()}`] : []),
          ...(form.type === "umrah" && form.nightBreakdown.trim()
            ? [`Nights Breakup: ${form.nightBreakdown.trim()}`]
            : []),
          ...(form.type === "umrah" && form.childWithoutBed.trim()
            ? [`Child Without Bed: ${form.childWithoutBed.trim()} PKR`]
            : []),
          ...(form.type === "umrah" && form.infant.trim() ? [`Infant: ${form.infant.trim()} PKR`] : []),
          ...(form.type === "umrah" && form.includedText.trim()
            ? [`Included: ${form.includedText.trim()}`]
            : []),
        ],
        requirements: linesToArray(form.requirementsText),
        notes: linesToArray(form.notesText),
        overseas_discount: form.type === "hajj" ? form.overseasDiscount || null : null,
        prices: {
          double: form.double ? Number(form.double) : undefined,
          triple: form.triple ? Number(form.triple) : undefined,
          quad: form.quad ? Number(form.quad) : undefined,
          quint: form.type === "umrah" && form.quint ? Number(form.quint) : undefined,
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

  const applySampleHajj = () => {
    setForm((p) => ({
      ...p,
      name: "13/14 Days Package (Maktab B)",
      type: "hajj",
      duration: "13/14 Days",
      description: "Hajj package with Madina stay, Aziziya stay, and full 5-day Hajj support.",
      featured: false,
      maktab: "B",
      nightBreakdown: "",
      childWithoutBed: "",
      infant: "",
      includedText: "",
      double: "1934000",
      triple: "1874000",
      quad: "1839000",
      quint: "",
      flightRoute: "ISB → MED",
      flightDate: "28 May | 1 ZH 1446 H",
      flightNo: "",
      flightDeparture: "",
      flightArrival: "",
      returnRoute: "Makkah/Aziziya → Jeddah Airport",
      returnDate: "10/11 June",
      returnFlightNo: "",
      returnDeparture: "",
      returnArrival: "",
      itineraryText: [
        "4 Nights Stay in Madina|28 May – 1 June|1 ZH – 4 ZH|4 Nights",
        "Aziziya Stay|1 June – 3/4 June|4 ZH – 6/7 ZH|2-3 Nights",
        "5 Days Hajj|4 June – 8 June|8 ZH – 12 ZH|5 Days",
        "Back to Aziziya|8 June – 10/11 June|12 ZH – 14/15 ZH|2-3 Nights",
        "Departure to Jeddah Airport|10/11 June||",
      ].join("\n"),
      packageDetailsText: [
        "Madina Hotel: Grand Plaza Badr Al-Maqam (3 Star – Full Board)",
        "Aziziya Building: Behind Souq Salam, Near Electric Escalator (Jamrat)",
        "Aziziya building near Mina",
        "3 time daily buffet meal (double dish)",
        "Accommodation on bed sharing basis",
        "Triple room extra Rs 20,000 per head",
        "Quad room extra Rs 15,000 per head",
        "Guided Ziarat in Madinah",
        "Ziarat by experienced Islamic scholars",
        "Ahram included",
      ].join("\n"),
      requirementsText: "Passport\nCNIC\nPhotographs",
      notesText: "USD rates: Quad 6570, Triple 6695, Double 6910",
      overseasDiscount: "Overseas Hujjaj: Rs 300,000 per ticket",
    }));
  };

  const applySampleUmrah = () => {
    setForm((p) => ({
      ...p,
      name: "15 Days Umrah Package",
      type: "umrah",
      duration: "15 Days",
      description: "Umrah package with flights, hotel stay, transport, visa, and ziarat.",
      featured: false,
      maktab: "",
      nightBreakdown: "6-8-6",
      childWithoutBed: "199000",
      infant: "79000",
      includedText: "Visa, Ticket, Hotel, Transport, Ziarat",
      double: "384000",
      triple: "332000",
      quad: "309000",
      quint: "292000",
      flightRoute: "ISB – JED",
      flightDate: "14 Jan",
      flightNo: "Saudia SV 723",
      flightDeparture: "17:40",
      flightArrival: "21:35",
      returnRoute: "JED – ISB",
      returnDate: "28 Jan",
      returnFlightNo: "Saudia SV 728",
      returnDeparture: "09:25",
      returnArrival: "16:05",
      itineraryText: [
        "Makkah Stay|14 Jan – 20 Jan||6 Nights",
        "Madinah Stay|20 Jan – 28 Jan||8 Nights",
      ].join("\n"),
      packageDetailsText: [
        "Makkah Hotel: Mather Al Jawar",
        "Makkah Distance: 500 Meter",
        "Madina Hotel: Mahad Al Madina",
        "Madina Distance: 600–700 Meter",
      ].join("\n"),
      requirementsText: "Passport\nCNIC\nPhotographs",
      notesText: "",
      overseasDiscount: "",
    }));
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={applySampleHajj}>Load Sample Hajj Data</Button>
                  <Button type="button" variant="outline" onClick={applySampleUmrah}>Load Sample Umrah Data</Button>
                </div>
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
                  {form.type === "umrah" && (
                    <div className="space-y-2"><Label>Price (Quint)</Label><Input type="number" placeholder="0" value={form.quint} onChange={(e) => setForm((p) => ({ ...p, quint: e.target.value }))} /></div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{form.type === "hajj" ? "Aziziya Building/Hotel" : "Makkah Hotel"}</Label>
                  <Select value={form.makkahHotelId} onValueChange={(v) => setForm((p) => ({ ...p, makkahHotelId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select Hotel" /></SelectTrigger>
                    <SelectContent>
                      {(hotels || [])
                        .filter((h) => (form.type === "hajj" ? h.city === 'Aziziya' : h.city === 'Makkah'))
                        .map(h => (
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
                  <Textarea
                    rows={5}
                    placeholder={
                      form.type === "hajj"
                        ? "4 Nights Stay in Madina|28 May – 1 June|1-5 ZH|4 Nights\nAziziya Stay|1 June – 3/4 June|5-7 ZH|2-3 Nights\n5 Days Hajj|4 June – 8 June|8-12 ZH|5 Days"
                        : "Makkah Stay|14 Jan – 20 Jan||6 Nights\nMadinah Stay|20 Jan – 28 Jan||8 Nights"
                    }
                    value={form.itineraryText}
                    onChange={(e) => setForm((p) => ({ ...p, itineraryText: e.target.value }))}
                  />
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
                  <>
                    <div className="space-y-2">
                      <Label>Maktab</Label>
                      <Input placeholder="e.g. B" value={form.maktab} onChange={(e) => setForm((p) => ({ ...p, maktab: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Overseas Discount</Label>
                      <Input placeholder="e.g. Overseas Hujjaj: Rs 300,000 per ticket" value={form.overseasDiscount} onChange={(e) => setForm((p) => ({ ...p, overseasDiscount: e.target.value }))} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Nights Breakdown</Label>
                      <Input placeholder="e.g. 6-8-6" value={form.nightBreakdown} onChange={(e) => setForm((p) => ({ ...p, nightBreakdown: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Child Without Bed (PKR)</Label>
                        <Input type="number" placeholder="e.g. 199000" value={form.childWithoutBed} onChange={(e) => setForm((p) => ({ ...p, childWithoutBed: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Infant (PKR)</Label>
                        <Input type="number" placeholder="e.g. 79000" value={form.infant} onChange={(e) => setForm((p) => ({ ...p, infant: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Included Services</Label>
                      <Input
                        placeholder="e.g. Visa, Ticket, Hotel, Transport, Ziarat"
                        value={form.includedText}
                        onChange={(e) => setForm((p) => ({ ...p, includedText: e.target.value }))}
                      />
                    </div>
                  </>
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
