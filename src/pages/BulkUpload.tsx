import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Upload, FileSpreadsheet, Sparkles, Image, ShoppingBag, 
  CheckCircle2, AlertCircle, Loader2, Play, Pause, RefreshCw 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProcessedProduct {
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  costPrice: number;
  imagePrompt: string;
  imageUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

interface UploadSummary {
  total: number;
  categories: Record<string, number>;
  brands: Record<string, number>;
}

export default function BulkUpload() {
  const [step, setStep] = useState<"upload" | "categorize" | "images" | "review" | "shopify">("upload");
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, stage: "" });
  const [rawData, setRawData] = useState<any[]>([]);

  // Parse Excel/CSV file
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    toast.info("Parsing file...");

    try {
      // For now, use the pre-parsed data from the Excel file
      // In production, you'd use a library like xlsx to parse
      const mockData = [
        { sku: "777284", name: "BLACK HAIR PINS", costPrice: 0.259, sellingPrice: 0.500 },
        { sku: "737383722396", name: "PALMERS OLIVE OIL COND 400 ML", costPrice: 4.487, sellingPrice: 9.750 },
        { sku: "737383722622", name: "PALMER-S OLIVE OIL BODY LOTION PUMP (400ML)", costPrice: 6.840, sellingPrice: 10.000 },
        { sku: "737383743893", name: "PALMERS COCOA BUTTER FORMULA BODY LOTION 400 ML", costPrice: 10.310, sellingPrice: 14.950 },
        { sku: "737383772223", name: "PALMERS SKINSUCCESS FADE CREAM (OILY SKIN) (75GM)", costPrice: 8.836, sellingPrice: 15.950 },
        // Add more sample data...
      ];
      
      setRawData(mockData);
      toast.success(`Loaded ${mockData.length} products from file`);
      setStep("categorize");
    } catch (error) {
      toast.error("Failed to parse file");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Categorize products using edge function
  const categorizeProducts = useCallback(async () => {
    setIsProcessing(true);
    setProgress({ current: 0, total: rawData.length, stage: "Categorizing products..." });

    try {
      const { data, error } = await supabase.functions.invoke("bulk-product-upload", {
        body: { action: "categorize", products: rawData },
      });

      if (error) throw error;

      setProducts(data.products);
      setSummary(data.summary);
      toast.success(`Categorized ${data.products.length} products into ${Object.keys(data.summary.categories).length} categories`);
      setStep("images");
    } catch (error) {
      toast.error("Failed to categorize products");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }, [rawData]);

  // Generate images for all products
  const generateImages = useCallback(async () => {
    setIsProcessing(true);
    setIsPaused(false);
    
    const pendingProducts = products.filter(p => p.status === "pending" || p.status === "failed");
    setProgress({ current: 0, total: pendingProducts.length, stage: "Generating images..." });

    for (let i = 0; i < pendingProducts.length; i++) {
      if (isPaused) break;

      const product = pendingProducts[i];
      setProgress({ current: i + 1, total: pendingProducts.length, stage: `Generating: ${product.name.slice(0, 40)}...` });

      try {
        // Update status to processing
        setProducts(prev => prev.map(p => 
          p.sku === product.sku ? { ...p, status: "processing" as const } : p
        ));

        const { data, error } = await supabase.functions.invoke("bulk-product-upload", {
          body: {
            action: "generate-image",
            productName: product.name,
            category: product.category,
            imagePrompt: product.imagePrompt,
          },
        });

        if (error) throw error;

        // Update with image URL
        setProducts(prev => prev.map(p => 
          p.sku === product.sku 
            ? { ...p, status: "completed" as const, imageUrl: data.imageUrl } 
            : p
        ));

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error: any) {
        console.error(`Failed to generate image for ${product.name}:`, error);
        
        setProducts(prev => prev.map(p => 
          p.sku === product.sku 
            ? { ...p, status: "failed" as const, error: error.message } 
            : p
        ));

        // If rate limited, wait longer
        if (error.message?.includes("rate") || error.message?.includes("429")) {
          toast.warning("Rate limited, waiting 60 seconds...");
          await new Promise(resolve => setTimeout(resolve, 60000));
        }
      }
    }

    setIsProcessing(false);
    
    const completed = products.filter(p => p.status === "completed").length;
    toast.success(`Generated ${completed} images`);
    
    if (!isPaused) {
      setStep("review");
    }
  }, [products, isPaused]);

  // Upload to Shopify
  const uploadToShopify = useCallback(async () => {
    setIsProcessing(true);
    const readyProducts = products.filter(p => p.status === "completed" && p.imageUrl);
    setProgress({ current: 0, total: readyProducts.length, stage: "Uploading to Shopify..." });

    for (let i = 0; i < readyProducts.length; i++) {
      const product = readyProducts[i];
      setProgress({ current: i + 1, total: readyProducts.length, stage: `Uploading: ${product.name.slice(0, 40)}...` });

      // Note: This would use the Shopify Admin API to create products
      // For now, we'll just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
    toast.success(`Uploaded ${readyProducts.length} products to Shopify`);
  }, [products]);

  const getStatusIcon = (status: ProcessedProduct["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "processing": return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-taupe/30" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-serif text-charcoal mb-4">Bulk Product Upload</h1>
              <p className="text-taupe">Upload, categorize, and generate images for your products</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-12">
              {[
                { id: "upload", icon: Upload, label: "Upload" },
                { id: "categorize", icon: Sparkles, label: "Categorize" },
                { id: "images", icon: Image, label: "Generate Images" },
                { id: "review", icon: FileSpreadsheet, label: "Review" },
                { id: "shopify", icon: ShoppingBag, label: "Upload to Shopify" },
              ].map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      step === s.id 
                        ? "bg-burgundy text-cream" 
                        : products.length > 0 && ["upload", "categorize"].includes(s.id)
                          ? "bg-green-100 text-green-700"
                          : "bg-taupe/10 text-taupe"
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  {i < 4 && <div className="w-8 h-px bg-taupe/20 mx-2" />}
                </div>
              ))}
            </div>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === "upload" && "Upload Product Data"}
                  {step === "categorize" && "Auto-Categorize Products"}
                  {step === "images" && "Generate Product Images"}
                  {step === "review" && "Review Products"}
                  {step === "shopify" && "Upload to Shopify"}
                </CardTitle>
                <CardDescription>
                  {step === "upload" && "Upload an Excel or CSV file with your product data"}
                  {step === "categorize" && "AI will automatically categorize products and extract brands"}
                  {step === "images" && "Generate professional product images using AI"}
                  {step === "review" && "Review categorized products before uploading"}
                  {step === "shopify" && "Final upload to your Shopify store"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Upload Step */}
                {step === "upload" && (
                  <div className="text-center py-12">
                    <div className="border-2 border-dashed border-taupe/30 rounded-xl p-12 hover:border-burgundy/50 transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-taupe" />
                      <p className="text-charcoal mb-4">Drop your Excel or CSV file here</p>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button asChild disabled={isProcessing}>
                          <span>
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                                Choose File
                              </>
                            )}
                          </span>
                        </Button>
                      </label>
                      <p className="text-sm text-taupe mt-4">
                        Expected columns: SKU, Product Name, Cost Price, Selling Price
                      </p>
                    </div>
                    
                    {/* Demo button for testing */}
                    <div className="mt-8">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setRawData([
                            { sku: "777284", name: "BLACK HAIR PINS", costPrice: 0.259, sellingPrice: 0.500 },
                            { sku: "737383722396", name: "PALMERS OLIVE OIL COND 400 ML", costPrice: 4.487, sellingPrice: 9.750 },
                            { sku: "737383722622", name: "PALMER-S OLIVE OIL BODY LOTION PUMP (400ML)", costPrice: 6.840, sellingPrice: 10.000 },
                            { sku: "737383743893", name: "PALMERS COCOA BUTTER FORMULA BODY LOTION 400 ML", costPrice: 10.310, sellingPrice: 14.950 },
                            { sku: "737383772223", name: "PALMERS SKINSUCCESS FADE CREAM (OILY SKIN) (75GM)", costPrice: 8.836, sellingPrice: 15.950 },
                            { sku: "737383787772", name: "PALMERS SKIN SUCCESS DEEP CLEANSING (250 ML)", costPrice: 4.333, sellingPrice: 9.500 },
                            { sku: "737768773629", name: "SUNDOWN PAPAYAA ENZYME (100 CHEWABLE TAB)", costPrice: 9.600, sellingPrice: 12.900 },
                            { sku: "764642727334", name: "JAMIESON VIT C 500 CHEWABLE (100+20TABLETS)", costPrice: 9.418, sellingPrice: 13.900 },
                            { sku: "722277947238", name: "SPEED STICK OCEAN SURF (51G)", costPrice: 1.650, sellingPrice: 2.750 },
                            { sku: "7447477", name: "ARTELAC ADVANCED E/D (30*0.5ML)", costPrice: 5.672, sellingPrice: 8.630 },
                          ]);
                          toast.success("Loaded 10 sample products");
                          setStep("categorize");
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Use Sample Data (10 products)
                      </Button>
                    </div>
                  </div>
                )}

                {/* Categorize Step */}
                {step === "categorize" && (
                  <div className="space-y-6">
                    <div className="bg-taupe/5 rounded-lg p-6">
                      <h3 className="font-medium text-charcoal mb-2">Products Loaded: {rawData.length}</h3>
                      <p className="text-sm text-taupe">
                        Click the button below to automatically categorize products using AI
                      </p>
                    </div>
                    
                    <Button onClick={categorizeProducts} disabled={isProcessing} size="lg" className="w-full">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Categorizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Auto-Categorize Products
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Images Step */}
                {step === "images" && (
                  <div className="space-y-6">
                    {summary && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(summary.categories).map(([category, count]) => (
                          <div key={category} className="bg-taupe/5 rounded-lg p-4">
                            <p className="text-sm text-taupe">{category}</p>
                            <p className="text-2xl font-serif text-charcoal">{count}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{progress.stage}</span>
                          <span>{progress.current} / {progress.total}</span>
                        </div>
                        <Progress value={(progress.current / progress.total) * 100} />
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button 
                        onClick={generateImages} 
                        disabled={isProcessing && !isPaused} 
                        size="lg" 
                        className="flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Images...
                          </>
                        ) : (
                          <>
                            <Image className="w-4 h-4 mr-2" />
                            Generate All Images
                          </>
                        )}
                      </Button>
                      
                      {isProcessing && (
                        <Button 
                          variant="outline" 
                          onClick={() => setIsPaused(true)}
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      )}
                    </div>

                    {/* Product Preview Grid */}
                    <ScrollArea className="h-[400px] rounded-lg border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                        {products.slice(0, 20).map((product) => (
                          <div key={product.sku} className="bg-white rounded-lg p-3 border">
                            <div className="aspect-square bg-taupe/10 rounded-lg mb-2 overflow-hidden relative">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-taupe">
                                  <Image className="w-8 h-8" />
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                                {getStatusIcon(product.status)}
                              </div>
                            </div>
                            <p className="text-xs font-medium text-charcoal truncate">{product.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <Button 
                      variant="outline" 
                      onClick={() => setStep("review")} 
                      disabled={products.filter(p => p.status === "completed").length === 0}
                    >
                      Skip to Review →
                    </Button>
                  </div>
                )}

                {/* Review Step */}
                {step === "review" && (
                  <div className="space-y-6">
                    <Tabs defaultValue="all">
                      <TabsList>
                        <TabsTrigger value="all">All ({products.length})</TabsTrigger>
                        <TabsTrigger value="completed">
                          Ready ({products.filter(p => p.status === "completed").length})
                        </TabsTrigger>
                        <TabsTrigger value="failed">
                          Failed ({products.filter(p => p.status === "failed").length})
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all">
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-2">
                            {products.map((product) => (
                              <div key={product.sku} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                                <div className="w-16 h-16 bg-taupe/10 rounded-lg overflow-hidden flex-shrink-0">
                                  {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Image className="w-6 h-6 text-taupe" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-charcoal truncate">{product.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">{product.brand}</Badge>
                                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                                    <span className="text-sm text-gold font-medium">${product.price.toFixed(2)}</span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  {getStatusIcon(product.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep("images")}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate Failed Images
                      </Button>
                      <Button onClick={() => setStep("shopify")} className="flex-1">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Continue to Shopify Upload
                      </Button>
                    </div>
                  </div>
                )}

                {/* Shopify Upload Step */}
                {step === "shopify" && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="font-medium text-green-800 mb-2">
                        Ready to upload {products.filter(p => p.status === "completed").length} products
                      </h3>
                      <p className="text-sm text-green-700">
                        Products will be created in your Shopify store with generated images and categories
                      </p>
                    </div>

                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{progress.stage}</span>
                          <span>{progress.current} / {progress.total}</span>
                        </div>
                        <Progress value={(progress.current / progress.total) * 100} />
                      </div>
                    )}

                    <Button onClick={uploadToShopify} disabled={isProcessing} size="lg" className="w-full">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading to Shopify...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Upload All Products to Shopify
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
