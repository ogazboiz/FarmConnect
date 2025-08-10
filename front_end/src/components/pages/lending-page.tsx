"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  DollarSign, Clock, TrendingUp, Users, Shield,
  FileText, CheckCircle, 
  Percent, Target, Wallet, Info, Plus,
  PiggyBank, Handshake, BarChart3
} from "lucide-react"
import { toast } from "react-hot-toast"

interface LoanApplication {
  id: string
  borrower: string
  amount: number
  purpose: string
  term: number
  interestRate: number
  status: 'pending' | 'approved' | 'funded' | 'active' | 'completed' | 'defaulted'
  fundingProgress: number
  farmScore: number
  collateral: string
  estimatedValue: number
  monthlyPayment: number
  finalPayment: number
  createdAt: Date
}

interface CreditScore {
  overall: number
  platformRating: number
  cropSuccessRate: number
  paymentHistory: number
  communityStanding: number
  businessGrowth: number
  verificationLevel: number
}

export function LendingPage() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedLoanType, setSelectedLoanType] = useState("")
  
  // Loan application state
  const [loanAmount, setLoanAmount] = useState("")
  const [loanPurpose, setLoanPurpose] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [collateralDescription, setCollateralDescription] = useState("")
  const [collateralValue, setCollateralValue] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")

  // Mock data
  const [creditScore] = useState<CreditScore>({
    overall: 4.8,
    platformRating: 4.8,
    cropSuccessRate: 92,
    paymentHistory: 100,
    communityStanding: 4.5,
    businessGrowth: 85,
    verificationLevel: 95
  })

  const [loanApplications] = useState<LoanApplication[]>([
    {
      id: "1",
      borrower: "0x1234...5678",
      amount: 2500,
      purpose: "Seeds & Fertilizer",
      term: 4,
      interestRate: 9,
      status: "funded",
      fundingProgress: 100,
      farmScore: 4.8,
      collateral: "Spring tomato harvest",
      estimatedValue: 5500,
      monthlyPayment: 0,
      finalPayment: 2725,
      createdAt: new Date("2024-01-15")
    },
    {
      id: "2",
      borrower: "0x9876...4321",
      amount: 15000,
      purpose: "Irrigation Equipment",
      term: 18,
      interestRate: 8,
      status: "active",
      fundingProgress: 100,
      farmScore: 4.6,
      collateral: "Equipment + Future harvest",
      estimatedValue: 25000,
      monthlyPayment: 920,
      finalPayment: 0,
      createdAt: new Date("2024-02-01")
    }
  ])

  const loanTypes = [
    {
      type: "seasonal",
      name: "Seasonal Loans",
      range: "$500 - $5,000",
      term: "3-6 months",
      interest: "8-12% APR",
      purpose: "Seeds, fertilizer, seasonal costs",
      collateral: "Future crop harvest value",
      icon: "🌱"
    },
    {
      type: "equipment",
      name: "Equipment Loans", 
      range: "$1,000 - $25,000",
      term: "12-24 months",
      interest: "6-10% APR",
      purpose: "Tools, irrigation, greenhouse",
      collateral: "Equipment + future harvest",
      icon: "🚜"
    },
    {
      type: "emergency",
      name: "Emergency Loans",
      range: "$200 - $2,000", 
      term: "1-3 months",
      interest: "12-15% APR",
      purpose: "Weather damage, urgent needs",
      collateral: "Platform reputation + harvest",
      icon: "🚨"
    }
  ]

  const calculateLoanTerms = () => {
    const amount = parseFloat(loanAmount) || 0
    const term = parseInt(loanTerm) || 1
    const rate = selectedLoanType === "seasonal" ? 0.09 : 
                 selectedLoanType === "equipment" ? 0.08 : 0.13
    
    const monthlyRate = rate / 12
    const monthlyPayment = selectedLoanType === "seasonal" ? 
      0 : // Seasonal loans are harvest-based
      (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
      (Math.pow(1 + monthlyRate, term) - 1)
    
    const finalPayment = selectedLoanType === "seasonal" ?
      amount * (1 + rate * (term / 12)) :
      0

    return {
      interestRate: (rate * 100).toFixed(1),
      monthlyPayment: monthlyPayment.toFixed(2),
      finalPayment: finalPayment.toFixed(2),
      totalCost: selectedLoanType === "seasonal" ? 
        finalPayment.toFixed(2) :
        (monthlyPayment * term).toFixed(2)
    }
  }

  const handleLoanSubmit = () => {
    if (!loanAmount || !loanPurpose || !loanTerm || !collateralDescription) {
      toast.error("Please fill in all required fields")
      return
    }

    // Here you would integrate with smart contracts
    toast.success("Loan application submitted! Decision in 24 hours ⏰")
    
    // Reset form and go back to overview
    setLoanAmount("")
    setLoanPurpose("")
    setLoanTerm("")
    setCollateralDescription("")
    setCollateralValue("")
    setAdditionalInfo("")
    setSelectedLoanType("")
    setActiveTab("overview")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-300 border-green-400/50"
      case "funded": return "bg-blue-500/20 text-blue-300 border-blue-400/50"
      case "active": return "bg-emerald-500/20 text-emerald-300 border-emerald-400/50"
      case "completed": return "bg-purple-500/20 text-purple-300 border-purple-400/50"
      case "pending": return "bg-yellow-500/20 text-yellow-300 border-yellow-400/50"
      case "defaulted": return "bg-red-500/20 text-red-300 border-red-400/50"
      default: return "bg-slate-500/20 text-slate-300 border-slate-400/50"
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md mx-auto bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              <h2 className="mb-4 text-xl font-bold text-white">Connect Your Wallet</h2>
              <p className="mb-6 text-emerald-200">
                Connect your wallet to access agricultural lending services and build your credit history.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-800">
      <Header />
      
      <div className="px-4 pt-24 pb-16">
        <div className="container mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">
              💰 Agricultural Lending
            </h1>
            <p className="text-xl text-emerald-200">
              Access capital, build credit, and grow your farming business
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-emerald-800/40">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
              <TabsTrigger value="community">Community Pool</TabsTrigger>
              <TabsTrigger value="credit">Credit Profile</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Platform Stats */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <div className="text-2xl font-bold text-white">$500K+</div>
                    <div className="text-emerald-300">Loans Originated</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold text-white">4.2%</div>
                    <div className="text-emerald-300">Default Rate</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold text-white">200+</div>
                    <div className="text-emerald-300">Successful Loans</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Percent className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold text-white">10.5%</div>
                    <div className="text-emerald-300">Avg. Returns</div>
                  </CardContent>
                </Card>
              </div>

              {/* Loan Types */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-white">Available Loan Products</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {loanTypes.map((loan, index) => (
                    <Card key={index} className="transition-colors bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm hover:bg-emerald-700/40">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-200">
                          <span className="text-2xl">{loan.icon}</span>
                          {loan.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-emerald-300">Amount:</span>
                            <span className="font-medium text-white">{loan.range}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-300">Term:</span>
                            <span className="font-medium text-white">{loan.term}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-300">Interest:</span>
                            <span className="font-medium text-white">{loan.interest}</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-emerald-600/30">
                          <p className="text-sm text-emerald-200">{loan.purpose}</p>
                          <p className="mt-1 text-xs text-emerald-300/80">
                            Collateral: {loan.collateral}
                          </p>
                        </div>
                        <Button 
                          onClick={() => {
                            setSelectedLoanType(loan.type)
                            setActiveTab("apply")
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Loans */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-white">Recent Loan Activity</h2>
                <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {loanApplications.map((loan) => (
                        <div key={loan.id} className="flex items-center justify-between p-4 rounded-lg bg-emerald-700/30">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600/20">
                              <DollarSign className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white">${loan.amount.toLocaleString()}</div>
                              <div className="text-sm text-emerald-300">{loan.purpose}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(loan.status)}>
                              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                            </Badge>
                            <div className="mt-1 text-sm text-emerald-300/80">{loan.term} months</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Apply for Loan Tab */}
            <TabsContent value="apply" className="space-y-6">
              <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Loan Application</CardTitle>
                  <p className="text-emerald-200">Get funding for your agricultural needs</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Type Selection */}
                  <div className="space-y-2">
                    <Label className="text-emerald-200">Loan Type</Label>
                    <Select value={selectedLoanType} onValueChange={setSelectedLoanType}>
                      <SelectTrigger className="text-white bg-emerald-700/30 border-emerald-600/40">
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seasonal">🌱 Seasonal Loan</SelectItem>
                        <SelectItem value="equipment">🚜 Equipment Loan</SelectItem>
                        <SelectItem value="emergency">🚨 Emergency Loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-emerald-200">Loan Amount ($)</Label>
                        <Input
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          placeholder="2,500"
                          className="text-white bg-emerald-700/30 border-emerald-600/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-emerald-200">Purpose</Label>
                        <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                          <SelectTrigger className="text-white bg-emerald-700/30 border-emerald-600/40">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="seeds">Seeds & Fertilizer</SelectItem>
                            <SelectItem value="equipment">Equipment Purchase</SelectItem>
                            <SelectItem value="irrigation">Irrigation System</SelectItem>
                            <SelectItem value="greenhouse">Greenhouse Setup</SelectItem>
                            <SelectItem value="emergency">Emergency Repairs</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-emerald-200">Repayment Term (months)</Label>
                        <Select value={loanTerm} onValueChange={setLoanTerm}>
                          <SelectTrigger className="text-white bg-emerald-700/30 border-emerald-600/40">
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedLoanType === "emergency" && (
                              <>
                                <SelectItem value="1">1 Month</SelectItem>
                                <SelectItem value="2">2 Months</SelectItem>
                                <SelectItem value="3">3 Months</SelectItem>
                              </>
                            )}
                            {selectedLoanType === "seasonal" && (
                              <>
                                <SelectItem value="3">3 Months</SelectItem>
                                <SelectItem value="4">4 Months (After Harvest)</SelectItem>
                                <SelectItem value="6">6 Months</SelectItem>
                              </>
                            )}
                            {selectedLoanType === "equipment" && (
                              <>
                                <SelectItem value="12">12 Months</SelectItem>
                                <SelectItem value="18">18 Months</SelectItem>
                                <SelectItem value="24">24 Months</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-emerald-200">Collateral Description</Label>
                        <Textarea
                          value={collateralDescription}
                          onChange={(e) => setCollateralDescription(e.target.value)}
                          placeholder="Spring tomato harvest"
                          className="text-white bg-emerald-700/30 border-emerald-600/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-emerald-200">Estimated Collateral Value ($)</Label>
                        <Input
                          type="number"
                          value={collateralValue}
                          onChange={(e) => setCollateralValue(e.target.value)}
                          placeholder="5,500"
                          className="text-white bg-emerald-700/30 border-emerald-600/40"
                        />
                      </div>
                    </div>

                    {/* Right Column - Farm Score & Loan Terms */}
                    <div className="space-y-4">
                      <Card className="bg-emerald-700/30 border-emerald-600/40">
                        <CardHeader>
                          <CardTitle className="text-lg text-emerald-200">Your Farm Score</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-emerald-300">Platform Rating:</span>
                            <span className="font-medium text-white">{creditScore.platformRating}★ (Excellent)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-300">Successful Crops:</span>
                            <span className="font-medium text-white">15</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-300">Customer Reviews:</span>
                            <span className="font-medium text-white">4.9★</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-300">Time on Platform:</span>
                            <span className="font-medium text-white">8 months</span>
                          </div>
                        </CardContent>
                      </Card>

                      {loanAmount && loanTerm && selectedLoanType && (
                        <Card className="bg-emerald-700/30 border-emerald-600/40">
                          <CardHeader>
                            <CardTitle className="text-lg text-emerald-200">Loan Terms</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {(() => {
                              const terms = calculateLoanTerms()
                              return (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-emerald-300">Interest Rate:</span>
                                    <span className="font-medium text-white">{terms.interestRate}% APR</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-emerald-300">Monthly Payment:</span>
                                    <span className="font-medium text-white">
                                      {selectedLoanType === "seasonal" ? "$0 (harvest payment)" : `$${terms.monthlyPayment}`}
                                    </span>
                                  </div>
                                  {selectedLoanType === "seasonal" && (
                                    <div className="flex justify-between">
                                      <span className="text-emerald-300">Final Payment:</span>
                                      <span className="font-medium text-white">${terms.finalPayment} (due at harvest)</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-emerald-300">Total Cost:</span>
                                    <span className="font-medium text-white">${terms.totalCost}</span>
                                  </div>
                                </>
                              )
                            })()}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-emerald-200">Additional Information (Optional)</Label>
                    <Textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Any additional details about your farming operation or loan needs..."
                      className="text-white bg-emerald-700/30 border-emerald-600/40"
                    />
                  </div>

                  <Alert className="bg-blue-900/40 border-blue-600/40">
                    <Info className="w-4 h-4" />
                    <AlertDescription className="text-blue-200">
                      <strong>Fast Processing:</strong> Loan decisions are made within 24 hours. 
                      Your application will be reviewed based on your farm score, collateral value, and platform history.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={handleLoanSubmit}
                    className="w-full text-white bg-emerald-600 hover:bg-emerald-700"
                    disabled={!selectedLoanType || !loanAmount || !loanPurpose || !loanTerm}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Community Pool Tab */}
            <TabsContent value="community" className="space-y-6">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-white">Community Lending Pool</h2>
                <p className="text-emerald-200">Support fellow farmers and earn returns through community-funded loans</p>
              </div>

              {/* Coming Soon Placeholder */}
              <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Handshake className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                  <h3 className="mb-4 text-2xl font-bold text-white">Community Lending Coming Soon</h3>
                  <p className="max-w-2xl mx-auto mb-6 text-emerald-200">
                    Join our community lending pool where multiple lenders can fund individual farmer loans. 
                    Earn 6-12% returns while supporting local agriculture.
                  </p>
                  <div className="grid max-w-4xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
                    <div className="p-4 rounded-lg bg-emerald-700/30">
                      <PiggyBank className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                      <h4 className="mb-2 font-semibold text-white">Low Minimum</h4>
                      <p className="text-sm text-emerald-300">Start lending with just $50</p>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-700/30">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                      <h4 className="mb-2 font-semibold text-white">Good Returns</h4>
                      <p className="text-sm text-emerald-300">Earn 6-12% annual returns</p>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-700/30">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                      <h4 className="mb-2 font-semibold text-white">Risk Protection</h4>
                      <p className="text-sm text-emerald-300">Community support system</p>
                    </div>
                  </div>
                  <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Join Waitlist
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Credit Profile Tab */}
            <TabsContent value="credit" className="space-y-6">
              <Card className="bg-emerald-800/40 border-emerald-700/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                    Your Credit Profile
                  </CardTitle>
                  <p className="text-emerald-200">Build your on-chain credit history</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="p-6 text-center rounded-lg bg-emerald-700/30">
                    <div className="mb-2 text-4xl font-bold text-white">{creditScore.overall}</div>
                    <div className="mb-4 text-emerald-300">Overall Credit Score</div>
                    <Badge className="text-green-300 bg-green-500/20 border-green-400/50">
                      Excellent
                    </Badge>
                  </div>

                  {/* Credit Factors */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-emerald-300">Platform Rating</span>
                          <span className="font-medium text-white">{creditScore.platformRating}/5.0</span>
                        </div>
                        <Progress value={(creditScore.platformRating / 5) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-emerald-300">Crop Success Rate</span>
                          <span className="font-medium text-white">{creditScore.cropSuccessRate}%</span>
                        </div>
                        <Progress value={creditScore.cropSuccessRate} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-emerald-300">Payment History</span>
                          <span className="font-medium text-white">{creditScore.paymentHistory}%</span>
                        </div>
                        <Progress value={creditScore.paymentHistory} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-emerald-300">Community Standing</span>
                          <span className="font-medium text-white">{creditScore.communityStanding}/5.0</span>
                        </div>
                        <Progress value={(creditScore.communityStanding / 5) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-emerald-300">Business Growth</span>
                          <span className="font-medium text-white">{creditScore.businessGrowth}%</span>
                        </div>
                        <Progress value={creditScore.businessGrowth} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-emerald-300">Verification Level</span>
                          <span className="font-medium text-white">{creditScore.verificationLevel}%</span>
                        </div>
                        <Progress value={creditScore.verificationLevel} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Credit History */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Credit History</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-700/30">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="font-medium text-white">Seasonal Loan #001</div>
                            <div className="text-sm text-emerald-300">Paid on time</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white">$2,500</div>
                          <div className="text-sm text-emerald-300">Jan 2024</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-700/30">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="font-medium text-white">Equipment Loan #002</div>
                            <div className="text-sm text-emerald-300">Active - On time</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white">$15,000</div>
                          <div className="text-sm text-emerald-300">Feb 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Improvement Tips */}
                  <Alert className="bg-emerald-900/40 border-emerald-600/40">
                    <Target className="w-4 h-4" />
                    <AlertDescription className="text-emerald-200">
                      <strong>Improve Your Score:</strong> Complete more crops successfully, 
                      participate in DAO governance, and maintain excellent payment history to access better loan terms.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* <Footer />? */}
    </div>
  )
}
