import { useMemo, useState } from "react";
import UserLayout from "@/components/user/UserLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { usePackages } from "@/hooks/useSupabase";
import type { PackageType } from "@/data/packages";
import PackageCard from "@/components/packages/PackageCard";
import PackageModal from "@/components/packages/PackageModal";

const UserApply = () => {
  const [packageType, setPackageType] = useState<"hajj" | "umrah">("hajj");
  const [selectedPkg, setSelectedPkg] = useState<PackageType | null>(null);
  const { data: packages = [], isLoading } = usePackages(packageType);

  const sortedPackages = useMemo(
    () => [...packages].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))),
    [packages]
  );

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Apply Again</h1>
            <p className="text-muted-foreground mt-1">
              Submit another Hajj or Umrah application from your existing portal account.
            </p>
          </div>
          <Card className="lg:max-w-md w-full border-accent/20 bg-accent/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-accent" /> Repeat applicant flow
              </CardTitle>
              <CardDescription>
                This creates a new booking under your current account. No temporary password is needed.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant={packageType === "hajj" ? "gold" : "outline"} onClick={() => setPackageType("hajj")}>
            Hajj Packages
          </Button>
          <Button variant={packageType === "umrah" ? "gold" : "outline"} onClick={() => setPackageType("umrah")}>
            Umrah Packages
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            : sortedPackages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} onViewDetails={setSelectedPkg} />)}
        </div>

        {!isLoading && sortedPackages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No active packages available right now.</div>
        )}
      </div>

      <PackageModal pkg={selectedPkg} open={!!selectedPkg} onClose={() => setSelectedPkg(null)} portalMode />
    </UserLayout>
  );
};

export default UserApply;
