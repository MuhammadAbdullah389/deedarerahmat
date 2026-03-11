import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { hajjPackages, umrahPackages, formatPrice } from "@/data/packages";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminPackages = () => {
  const [addOpen, setAddOpen] = useState(false);

  const renderHajjTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead className="font-semibold">Name</TableHead>
          <TableHead className="font-semibold">Duration</TableHead>
          <TableHead className="font-semibold">Maktab</TableHead>
          <TableHead className="font-semibold">Quad</TableHead>
          <TableHead className="font-semibold">Triple</TableHead>
          <TableHead className="hidden md:table-cell font-semibold">Double</TableHead>
          <TableHead className="font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hajjPackages.map((pkg) => (
          <TableRow key={pkg.id} className="hover:bg-muted/30">
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-emerald flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-sm">{pkg.name}</span>
                  {pkg.featured && <Badge className="ml-2 bg-accent/15 text-accent border border-accent/30 text-[10px]">Featured</Badge>}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-sm">{pkg.duration}</TableCell>
            <TableCell>
              <Badge variant="outline" className="font-mono text-xs">{pkg.maktab || '–'}</Badge>
            </TableCell>
            <TableCell className="text-sm font-medium">{pkg.prices.quad ? formatPrice(pkg.prices.quad) : '–'}</TableCell>
            <TableCell className="text-sm font-medium">{pkg.prices.triple ? formatPrice(pkg.prices.triple) : '–'}</TableCell>
            <TableCell className="hidden md:table-cell text-sm font-medium">{pkg.prices.double ? formatPrice(pkg.prices.double) : '–'}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Edit mode (mock)")}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => toast.info("Delete (mock)")}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderUmrahTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead className="font-semibold">Name</TableHead>
          <TableHead className="font-semibold">Duration</TableHead>
          <TableHead className="font-semibold">Nights</TableHead>
          <TableHead className="font-semibold">From</TableHead>
          <TableHead className="hidden md:table-cell font-semibold">Flight</TableHead>
          <TableHead className="font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {umrahPackages.map((pkg) => {
          const prices = Object.values(pkg.prices).filter(Boolean) as number[];
          const lowest = Math.min(...prices);
          return (
            <TableRow key={pkg.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg gradient-gold flex items-center justify-center">
                    <Package className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <span className="text-sm">{pkg.name}</span>
                    {pkg.featured && <Badge className="ml-2 bg-accent/15 text-accent border border-accent/30 text-[10px]">Featured</Badge>}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">{pkg.duration}</TableCell>
              <TableCell className="text-sm">{pkg.nightsBreakup || '–'}</TableCell>
              <TableCell className="text-sm font-medium">{formatPrice(lowest)}</TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{pkg.flightInfo?.date || '–'}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Edit mode (mock)")}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => toast.info("Delete (mock)")}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Package Management</h1>
            <p className="text-muted-foreground text-sm mt-1">{hajjPackages.length + umrahPackages.length} total packages</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2 shadow-md"><Plus className="h-4 w-4" /> Add Package</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">Add New Package</DialogTitle>
              </DialogHeader>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); toast.success("Package added (mock)"); setAddOpen(false); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Package Name</Label>
                    <Input placeholder="e.g. 20 Days Package (Maktab B – Anjum)" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="hajj">Hajj</SelectItem><SelectItem value="umrah">Umrah</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input placeholder="e.g. 20 Days" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maktab (Hajj only)</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem><SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem><SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nights Breakup (Umrah)</Label>
                    <Input placeholder="e.g. 6-8-6" />
                  </div>
                </div>

                <div className="h-px bg-border" />

                <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">Flight Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Departure Route</Label><Input placeholder="ISB → MED" /></div>
                  <div className="space-y-2"><Label>Departure Date</Label><Input placeholder="23 May | 25 ZQ 1446 H" /></div>
                  <div className="space-y-2"><Label>Flight Number</Label><Input placeholder="SV 723" /></div>
                  <div className="space-y-2"><Label>Return Route</Label><Input placeholder="JED → ISB" /></div>
                  <div className="space-y-2"><Label>Return Date</Label><Input placeholder="10/11 June" /></div>
                  <div className="space-y-2"><Label>Return Flight Number</Label><Input placeholder="SV 726" /></div>
                </div>

                <div className="h-px bg-border" />

                <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground">Pricing (PKR)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Sharing / Quint</Label><Input type="number" placeholder="0" /></div>
                  <div className="space-y-2"><Label>Quad</Label><Input type="number" placeholder="0" /></div>
                  <div className="space-y-2"><Label>Triple</Label><Input type="number" placeholder="0" /></div>
                  <div className="space-y-2"><Label>Double</Label><Input type="number" placeholder="0" /></div>
                </div>

                <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground">Pricing (USD) – Optional</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Quad USD</Label><Input type="number" placeholder="0" /></div>
                  <div className="space-y-2"><Label>Triple USD</Label><Input type="number" placeholder="0" /></div>
                  <div className="space-y-2"><Label>Double USD</Label><Input type="number" placeholder="0" /></div>
                </div>

                <div className="h-px bg-border" />

                <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground">Hotels</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2"><Label>Madinah Hotel</Label><Input placeholder="Hotel name" /></div>
                    <div className="space-y-2"><Label>Star Rating</Label><Input placeholder="3 Star – Full Board" /></div>
                    <div className="space-y-2"><Label>Distance</Label><Input placeholder="600m" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2"><Label>Makkah Hotel</Label><Input placeholder="Hotel name" /></div>
                    <div className="space-y-2"><Label>Star Rating</Label><Input placeholder="5 Star – Half Board" /></div>
                    <div className="space-y-2"><Label>Distance</Label><Input placeholder="450m" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2"><Label>Aziziya / 3rd Location</Label><Input placeholder="Building name" /></div>
                    <div className="space-y-2"><Label>Details</Label><Input placeholder="Near Mina" /></div>
                    <div className="space-y-2"><Label>Distance</Label><Input placeholder="Near Mina" /></div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground">Itinerary</h3>
                <Textarea placeholder="Enter itinerary items, one per line. Format: Label | Dates | Islamic Date | Duration (optional)" rows={5} />

                <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground">Package Details</h3>
                <Textarea placeholder="Enter package details, one per line" rows={4} />

                <div className="space-y-2">
                  <Label>Overseas Discount Info</Label>
                  <Input placeholder="e.g. Rs 300,000 per ticket for overseas Hujjaj" />
                </div>

                <Button type="submit" variant="gold" className="w-full shadow-md">Create Package</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="hajj">
          <TabsList className="bg-muted/60">
            <TabsTrigger value="hajj" className="gap-2 data-[state=active]:shadow-sm">
              Hajj <Badge variant="outline" className="text-[10px] h-5">{hajjPackages.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="umrah" className="gap-2 data-[state=active]:shadow-sm">
              Umrah <Badge variant="outline" className="text-[10px] h-5">{umrahPackages.length}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hajj">
            <Card className="shadow-md border-0 overflow-hidden"><CardContent className="p-0">{renderHajjTable()}</CardContent></Card>
          </TabsContent>
          <TabsContent value="umrah">
            <Card className="shadow-md border-0 overflow-hidden"><CardContent className="p-0">{renderUmrahTable()}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPackages;
