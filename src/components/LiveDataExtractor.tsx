import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Globe, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ScrapedData {
  title: string;
  description: string;
  link: string;
  category: string;
}

interface DemoSite {
  name: string;
  url: string;
  description: string;
  dataType: string;
}

const LiveDataExtractor = () => {
  const [customUrl, setCustomUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ScrapedData[]>([]);
  const [lastExtractedSite, setLastExtractedSite] = useState('');
  const [extractionTime, setExtractionTime] = useState(0);

  const demoSites: DemoSite[] = [
    {
      name: "US Chamber of Commerce",
      url: "https://www.uschamber.com",
      description: "Business news, policy updates, and economic insights",
      dataType: "News & Policy"
    },
    {
      name: "TechCrunch",
      url: "https://techcrunch.com",
      description: "Latest technology news and startup updates",
      dataType: "Tech News"
    },
    {
      name: "Reuters Business",
      url: "https://www.reuters.com/business/",
      description: "Global business and financial news",
      dataType: "Financial News"
    }
  ];

  // Simulated data extraction function (in real implementation, this would call a backend API)
  const simulateDataExtraction = (url: string): ScrapedData[] => {
    if (url.includes('uschamber.com')) {
      return [
        {
          title: "Small Business Economic Outlook Report",
          description: "Latest quarterly report on small business economic conditions and outlook for growth",
          link: "/economic-outlook/small-business-report",
          category: "Economic Reports"
        },
        {
          title: "Chamber Technology Engagement Center",
          description: "Resources and tools for businesses to leverage technology for growth and innovation",
          link: "/technology/engagement-center",
          category: "Technology"
        },
        {
          title: "International Trade Policy Updates",
          description: "Recent developments in trade policy affecting American businesses globally",
          link: "/international/trade-policy",
          category: "Policy"
        },
        {
          title: "Workforce Development Initiative",
          description: "Programs and partnerships to develop skilled workforce for American businesses",
          link: "/workforce/development",
          category: "Workforce"
        },
        {
          title: "Energy & Environment Policy Brief",
          description: "Chamber's position on energy independence and environmental sustainability",
          link: "/energy/policy-brief",
          category: "Energy"
        }
      ];
    } else if (url.includes('techcrunch.com')) {
      return [
        {
          title: "AI Startup Raises $50M Series B",
          description: "Artificial intelligence company secures funding for expansion into enterprise markets",
          link: "/ai-startup-funding-series-b",
          category: "Funding"
        },
        {
          title: "Cloud Infrastructure Trends 2025",
          description: "Analysis of emerging cloud technologies and their impact on business operations",
          link: "/cloud-infrastructure-trends",
          category: "Technology"
        },
        {
          title: "Cybersecurity IPO Market Update",
          description: "Recent cybersecurity companies going public and market reception analysis",
          link: "/cybersecurity-ipo-market",
          category: "IPO"
        }
      ];
    } else {
      return [
        {
          title: "Global Markets Overview",
          description: "Current market conditions and economic indicators from around the world",
          link: "/global-markets-overview",
          category: "Markets"
        },
        {
          title: "Industry Analysis Report",
          description: "Comprehensive analysis of key industry sectors and growth projections",
          link: "/industry-analysis",
          category: "Analysis"
        }
      ];
    }
  };

  const handleExtraction = async (url: string) => {
    setIsExtracting(true);
    setExtractionTime(0);
    setLastExtractedSite(url);
    
    // Simulate extraction time
    const timer = setInterval(() => {
      setExtractionTime(prev => prev + 0.1);
    }, 100);

    // Simulate API call delay
    setTimeout(() => {
      clearInterval(timer);
      const data = simulateDataExtraction(url);
      setExtractedData(data);
      setIsExtracting(false);
    }, 2000);
  };

  const handleCustomExtraction = () => {
    if (customUrl) {
      handleExtraction(customUrl);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(extractedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extracted_data.json';
    link.click();
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Live Data Extractor
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our web scraping capabilities in real-time. Extract structured data from any public website instantly.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Demo Sites */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Try Our Pre-configured Demos</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {demoSites.map((site, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleExtraction(site.url)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                    </div>
                    <CardDescription>{site.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {site.dataType}
                      </span>
                      <Button size="sm" disabled={isExtracting}>
                        {isExtracting && lastExtractedSite === site.url ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Extract Data'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom URL Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Custom Website Extraction
              </CardTitle>
              <CardDescription>
                Enter any public website URL to extract structured data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleCustomExtraction}
                  disabled={isExtracting || !customUrl}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Extracting...
                    </>
                  ) : (
                    'Extract Data'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Extraction Status */}
          {isExtracting && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-lg font-medium">Extracting data from {lastExtractedSite}</span>
                  </div>
                  <span className="text-sm text-gray-600">{extractionTime.toFixed(1)}s</span>
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((extractionTime / 2) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {extractedData.length > 0 && !isExtracting && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <CardTitle>Extracted Data Results</CardTitle>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {extractedData.length} items extracted in {extractionTime.toFixed(1)}s
                    </span>
                    <Button onClick={exportData} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Structured data extracted from {lastExtractedSite}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Link</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extractedData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="max-w-md truncate">{item.description}</TableCell>
                        <TableCell>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                            {item.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-blue-600 hover:underline cursor-pointer">
                          {item.link}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* CTA Section */}
          <div className="text-center mt-12">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold mb-4">
                  Need Custom Web Scraping Solutions?
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  This demo shows just a fraction of our capabilities. We can build custom scrapers for any website, 
                  with advanced features like real-time monitoring, data processing, and API integration.
                </p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Custom Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDataExtractor;
