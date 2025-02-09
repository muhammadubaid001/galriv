import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Upload,
  Download,
  User,
  BookOpen,
  ScrollText,
  Handshake,
  LogOut,
  Plus,
} from "lucide-react";
import { supabase } from "./lib/supabase";
import { Auth } from "./components/Auth";
import { AdminPanel } from "./components/AdminPanel";
import toast from "react-hot-toast";
import { MyChart } from "./components/MyChart";
import { MyPieChart } from "./components/MyPieChart";
import FileUploader from "./components/FileUploader";

function App() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading,setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeDocumentTab, setActiveDocumentTab] = useState("legal");
  const [addTrade, setAddTrade] = useState(false);
  const [tradeState, setTradeState] = useState({
    date: "",
    time: "",
    pair: "",
    type: "",
    entry: "",
    exit: "",
    pl: "",
  });
  const [accountData, setAccountData] = useState<any>({
    totalValue: 0,
    pnl: 0,
    pnlPercentage: 0,
    account: {
      id: 1,
      name: "Growth Account",
      value: 0,
      pnl: 0,
      pnlPercentage: 0,
    },
    operating_agreement_url: null,
    profit_split_agreement_url: null,
    withdrawal_terms_url: null,
    trades: [],
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkIfAdmin(session.user.id);
        fetchPortfolioData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkIfAdmin(session.user.id);
        fetchPortfolioData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkIfAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setAccountData({
        ...accountData,
        operating_agreement_url: data.operating_agreement_url,
        profit_split_agreement_url: data.profit_split_agreement_url,
        withdrawal_terms_url: data.withdrawal_terms_url,
      });

      
      if (error) throw error;
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };
  
  const fetchPortfolioData = async (userId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("portfolio_values")
        .select("*")
        .eq("user_id", userId)
        .single()

      const { data: trades, error: tradesError } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", userId)

      if (error) throw error
      if (tradesError) throw tradesError

      if (data) {
        setAccountData((prev) => ({
          ...prev,
          totalValue: data.total_value,
          pnl: data.pnl,
          pnlPercentage: data.pnl_percentage,
          account: {
            ...prev.account,
            value: data.total_value,
            pnl: data.pnl,
            pnlPercentage: data.pnl_percentage,
          },
          trades: trades,
        }))
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching portfolio data");
    } finally {
      setLoading(false)
    }

  }

  const addTrades = async () => {
    try {
      const { data: trades, error } = await supabase.from("trades").insert({
        user_id: session?.user?.id, // This links to auth.users
        ...tradeState,
      });

      if (error) throw error;

      if (trades) {
        setAccountData((prev) => ({
          ...prev,
          account: {
            ...prev.account,
          },
          trades,
        }))
      }
      setAddTrade(false);
    } catch (error) {
      console.log(error);
      toast.error("Error adding trade")
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error;
      setSession(null);
      setIsAdmin(false);
      setShowAdminPanel(false);
    } catch (error) {
      console.log(error);
      toast.error("Error signing out")
    }
  };

  if (!session) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-pattern">
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <header className="max-w-7xl mx-auto bg-emerald-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-700/50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <h1 className="text-2xl font-semibold text-yellow-400">
                Galriv Capital
              </h1>

              {/* Navigation */}
              <nav className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`nav-tab ${
                    activeTab === "dashboard"
                      ? "active bg-emerald-700/80 text-white shadow-lg"
                      : "text-white hover:bg-emerald-700/50 hover:text-yellow-400"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`nav-tab flex items-center ${
                    activeTab === "documents"
                      ? "active bg-emerald-700/80 text-yellow-400 shadow-lg"
                      : "text-emerald-100 hover:bg-emerald-700/50 hover:text-yellow-400"
                  }`}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab("deposit")}
                  className={`nav-tab flex items-center ${
                    activeTab === "deposit"
                      ? "active bg-emerald-700/80 text-yellow-400 shadow-lg"
                      : "text-emerald-100 hover:bg-emerald-700/50 hover:text-yellow-400"
                  }`}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Deposit
                </button>
                <button
                  onClick={() => window.open("https://8hksev623y3.typeform.com/to/DooFLb0u", "_blank")}
                  className={`nav-tab flex items-center ${
                    activeTab === "withdraw"
                      ? "active bg-emerald-700/80 text-yellow-400 shadow-lg"
                      : "text-emerald-100 hover:bg-emerald-700/50 hover:text-yellow-400"
                  }`}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Withdraw
                </button>
                <div className="relative">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`nav-tab p-2 rounded-full ${
                      activeTab === "profile"
                        ? "active bg-emerald-700/80 text-yellow-400 shadow-lg"
                        : "text-emerald-100 hover:bg-emerald-700/50 hover:text-yellow-400"
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </header>
      </div>

      {/* Add padding to account for fixed header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {activeTab === "dashboard" && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="card-glow shadow-lg rounded-lg border border-emerald-600/30">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-emerald-100 truncate">
                          Total Portfolio Value
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-white">
                            ${accountData.totalValue.toLocaleString()}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-glow shadow-lg rounded-lg border border-emerald-600/30">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {accountData.pnl >= 0 ? (
                        <TrendingUp className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-400" />
                      )}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-emerald-100 truncate">
                          Total P&L
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-white">
                            ${accountData.pnl.toLocaleString()}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-glow shadow-lg rounded-lg border border-emerald-600/30">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Percent className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-emerald-100 truncate">
                          Return Rate
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-white">
                            {accountData.pnlPercentage}%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="card-glow shadow-lg rounded-lg border border-emerald-600/30 mb-8">
              <div className="px-4 py-5 sm:px-6 border-b border-emerald-700">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Account Breakdown
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flow-root">
                  <div className="py-5">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xl font-semibold text-white">
                          {accountData.account.name}
                        </p>
                        <p className="text-2xl font-bold text-yellow-400 mt-2">
                          ${accountData.account.value.toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div
                          className={`flex items-center text-lg ${
                            accountData.account.pnl >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {accountData.account.pnl >= 0 ? (
                            <ArrowUpRight className="h-5 w-5 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 mr-1" />
                          )}
                          <span className="font-bold">
                            {accountData.account.pnlPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
              <div className="card-glow  p-6 rounded-lg shadow-lg border border-emerald-600/30">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-5 w-5 text-yellow-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">
                    Performance History
                  </h3>
                </div>
                <div className="w-full bg-emerald-700/50 rounded">
                  <MyChart loading={loading} data={accountData.trades} />
                </div>
              </div>

              <div className="card-glow p-6 rounded-lg shadow-lg border border-emerald-600/30">
                <div className="flex items-center mb-4">
                  <PieChart className="h-5 w-5 text-yellow-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">
                    Asset Allocation
                  </h3>
                </div>
                <div className=" bg-emerald-700/50 rounded">
                  <MyPieChart data={accountData}/>
                </div>
              </div>
            </div>

            {/* Trades Table */}
            <div className="card-glow p-6 rounded-lg shadow-lg border border-emerald-600/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">
                  Recent Trades
                </h3>
                {addTrade ? (
                  <button
                    onClick={addTrades}
                    type="button"
                    className={`nav-tab flex items-center active bg-emerald-700/80 text-yellow-400 shadow-lg`}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setAddTrade(true)}
                    className={`nav-tab flex items-center active bg-emerald-700/80 text-yellow-400 shadow-lg`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Trade
                  </button>
                )}
              </div>
              {!addTrade ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-emerald-700">
                        <th className="px-4 py-2 text-left text-sm font-medium text-emerald-100">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-emerald-100">
                          Time
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-emerald-100">
                          Pair
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-emerald-100">
                          Type
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-emerald-100">
                          Entry
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-emerald-100">
                          Exit
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-emerald-100">
                          P&L
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountData.trades.map((trade: any) => (
                        <tr
                          key={trade.id}
                          className="border-b border-emerald-700"
                        >
                          <td className="px-4 py-2 text-sm text-emerald-100">
                            {trade.date}
                          </td>
                          <td className="px-4 py-2 text-sm text-emerald-100">
                            {trade.time}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-emerald-100">
                            {trade.pair}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                trade.type === "BUY"
                                  ? "bg-emerald-700 text-emerald-100"
                                  : "bg-red-900 text-red-100"
                              }`}
                            >
                              {trade.type}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-emerald-100">
                            ${trade.entry.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-emerald-100">
                            ${trade.exit.toLocaleString()}
                          </td>
                          <td
                            className={`px-4 py-2 text-sm text-right font-medium ${
                              trade.pnl >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            ${trade.pl.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <form className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-white text-sm">Date</label>
                    <input
                      type="date"
                      onChange={(e) =>
                        setTradeState({
                          ...tradeState,
                          date: e.target.value,
                        })
                      }
                      className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white text-sm">Time</label>
                    <input
                      type="time"
                      onChange={(e) =>
                        setTradeState({
                          ...tradeState,
                          time: e.target.value,
                        })
                      }
                      className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white text-sm">Pair</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setTradeState({
                          ...tradeState,
                          pair: e.target.value,
                        })
                      }
                      className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white text-sm">Type</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setTradeState({
                          ...tradeState,
                          type: e.target.value,
                        })
                      }
                      className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white text-sm">Entry</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setTradeState({
                          ...tradeState,
                          entry: e.target.value,
                        })
                      }
                      className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white text-sm">Exit</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setTradeState({
                          ...tradeState,
                          exit: e.target.value,
                        })
                      }
                      className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white text-sm">P & L</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setTradeState({
                          ...tradeState,
                          pl: e.target.value,
                        })
                      }
                      className="bg-transparent border rounded-md p-2 focus:ring-0 focus:outline-none text-white border-yellow-400 "
                    />
                  </div>
                </form>
              )}
            </div>
          </>
        )}

        {activeTab === "documents" && (
          <div className="space-y-6">
            {/* Document Navigation */}
            <div className="card-glow p-6 rounded-lg shadow-lg border border-emerald-600/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Documents</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveDocumentTab("legal")}
                    className={`px-4 py-2 rounded-md transition-all duration-300 ${
                      activeDocumentTab === "legal"
                        ? "bg-emerald-700 text-yellow-400 shadow-lg"
                        : "text-emerald-100 hover:bg-emerald-700/50 hover:text-yellow-400"
                    }`}
                  >
                    Legal Documents
                  </button>
                  <button
                    onClick={() => setActiveDocumentTab("blog")}
                    className={`px-4 py-2 rounded-md transition-all duration-300 ${
                      activeDocumentTab === "blog"
                        ? "bg-emerald-700 text-yellow-400 shadow-lg"
                        : "text-emerald-100 hover:bg-emerald-700/50 hover:text-yellow-400"
                    }`}
                  >
                    Blog
                  </button>
                </div>
              </div>

              {/* Legal Documents Section */}
              {activeDocumentTab === "legal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Operating Agreement */}
                  {accountData.operating_agreement_url ? (
                    <div className="p-6 bg-emerald-800/50 rounded-lg border border-emerald-600/30 hover:border-yellow-400/30 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <ScrollText className="h-8 w-8 text-yellow-400 mr-3" />
                        <h3 className="text-lg font-medium text-white">
                          Operating Agreement
                        </h3>
                      </div>
                      <p className="text-emerald-100 mb-4">
                        Comprehensive details about company operations,
                        management structure, and member rights.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          window.open(
                            accountData.operating_agreement_url,
                            "_blank"
                          );
                        }}
                        className="w-full px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300"
                      >
                        View Document
                      </button>
                    </div>
                  ) : (
                    <FileUploader type="operating" user={session.user.id} />
                  )}

                  {/* Profit Split Agreement */}
                  {accountData.profit_split_agreement_url ? (
                    <div className="p-6 bg-emerald-800/50 rounded-lg border border-emerald-600/30 hover:border-yellow-400/30 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <Handshake className="h-8 w-8 text-yellow-400 mr-3" />
                        <h3 className="text-lg font-medium text-white">
                          Profit Split Agreement
                        </h3>
                      </div>
                      <p className="text-emerald-100 mb-4">
                        Detailed breakdown of profit distribution among members
                        and stakeholders.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          window.open(
                            accountData.profit_split_agreement_url,
                            "_blank"
                          );
                        }}
                        className="w-full px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300"
                      >
                        View Document
                      </button>
                    </div>
                  ) : (
                    <FileUploader type="profit_split" user={session.user.id} />
                  )}

                  {/* Withdrawal Terms */}
                  {accountData.withdrawal_terms_url ? (
                    <div className="p-6 bg-emerald-800/50 rounded-lg border border-emerald-600/30 hover:border-yellow-400/30 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <LogOut className="h-8 w-8 text-yellow-400 mr-3" />
                        <h3 className="text-lg font-medium text-white">
                          Withdrawal Terms
                        </h3>
                      </div>
                      <p className="text-emerald-100 mb-4">
                        Terms and conditions for member withdrawal and capital
                        distribution.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          window.open(
                            accountData.withdrawal_terms_url,
                            "_blank"
                          );
                        }}
                        className="w-full px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300"
                      >
                        View Document
                      </button>
                    </div>
                  ) : (
                    <FileUploader type="withdrawal" user={session.user.id} />
                  )}
                </div>
              )}

              {/* Blog Section */}
              {activeDocumentTab === "blog" && (
                <div className="space-y-6">
                  {/* Featured Post */}
                  <div className="p-6 bg-emerald-800/50 rounded-lg border border-emerald-600/30 hover:border-yellow-400/30 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-6 w-6 text-yellow-400 mr-2" />
                      <span className="text-yellow-400 text-sm font-medium">
                        Featured Post
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Understanding Market Volatility: A Comprehensive Guide
                    </h3>
                    <p className="text-emerald-100 mb-4">
                      Learn about the factors that influence market volatility
                      and how to navigate turbulent times in the financial
                      markets.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200 text-sm">
                        March 14, 2024
                      </span>
                      <button className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300">
                        Read More
                      </button>
                    </div>
                  </div>

                  {/* Recent Posts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Post 1 */}
                    <div className="p-6 bg-emerald-800/50 rounded-lg border border-emerald-600/30 hover:border-yellow-400/30 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Technical Analysis: Key Patterns to Watch
                      </h3>
                      <p className="text-emerald-100 mb-4">
                        Essential technical analysis patterns that every trader
                        should know and understand.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-200 text-sm">
                          March 12, 2024
                        </span>
                        <button className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300">
                          Read More
                        </button>
                      </div>
                    </div>

                    {/* Recent Post 2 */}
                    <div className="p-6 bg-emerald-800/50 rounded-lg border border-emerald-600/30 hover:border-yellow-400/30 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Risk Management Strategies for 2024
                      </h3>
                      <p className="text-emerald-100 mb-4">
                        Updated risk management approaches to protect your
                        investments in the current market.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-200 text-sm">
                          March 10, 2024
                        </span>
                        <button className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300">
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "deposit" && (
          <div className="card-glow p-6 rounded-lg shadow-lg border border-emerald-600/30">
            <div className="flex items-center mb-6">
              <Upload className="h-6 w-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl font-semibold text-white">
                Deposit Funds
              </h2>
            </div>

            <div className="bg-emerald-800/50 rounded-lg p-6 border border-emerald-600/30">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-yellow-400 mb-2">
                    Wire Transfer Instructions
                  </h3>
                  <p className="text-emerald-100 mb-4">
                    To fund your account, please send a wire transfer with the
                    desired amount (minimum $25,000 USD) to the following
                    account. Make sure to include your full name in the
                    reference field.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-emerald-200 mb-2">
                      Bank Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-emerald-100">Beneficiary:</span>
                        <span className="text-white font-medium">
                          Pip Masters Trading LLC
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">
                          Routing Number:
                        </span>
                        <span className="text-white font-medium">
                          026009593
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">SWIFT Code:</span>
                        <span className="text-white font-medium">BOFAUS3N</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-emerald-200 mb-2">
                      Address
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-emerald-100">Street:</span>
                        <span className="text-white font-medium">
                          300 West Tyler Street
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">City:</span>
                        <span className="text-white font-medium">Tampa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">State, ZIP:</span>
                        <span className="text-white font-medium">
                          FL, 33602
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-yellow-400">
                        Minimum Deposit
                      </h4>
                      <p className="text-emerald-100">$25,000 USD</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-900/30 p-4 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-emerald-100">
                      <strong className="text-yellow-400">Important:</strong>{" "}
                      Please ensure your name is included in the wire transfer
                      reference to expedite the processing of your deposit.
                    </p>
                  </div>
                  <div className="border-t border-emerald-700/50 pt-4">
                    <p className="text-sm text-emerald-100">
                      <strong className="text-yellow-400">
                        Wire Confirmation:
                      </strong>{" "}
                      After sending the wire, please email the confirmation to{" "}
                      <a
                        href="mailto:emilio@galrivcapital.com"
                        className="text-yellow-400 hover:underline"
                      >
                        emilio@galrivcapital.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "withdraw" && (
          <div className="card-glow p-6 rounded-lg shadow-lg border border-emerald-600/30">
            <div className="flex items-center mb-6">
              <Download className="h-6 w-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl font-semibold text-white">
                {" "}
                Withdraw Funds
              </h2>
            </div>

            <div className="bg-emerald-800/50 rounded-lg p-6 border border-emerald-600/30">
              <div className="space-y-6">
                <div className="text-emerald-100">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Only one withdrawal per quarter is allowed</li>
                    <li>Minimum withdrawal amount is $2,500</li>
                    <li>
                      Withdrawal must be requested between the last 5 and first
                      5 days at the crossover between each quarter
                    </li>
                    <li>
                      Multiple requests at once will be denied and only first
                      request will be processed
                    </li>
                  </ul>
                </div>

                <button className="w-full px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300">
                  Request Withdrawal
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="card-glow p-6 rounded-lg shadow-lg border border-emerald-600/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Profile</h2>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-emerald-800"
              >
                Sign Out
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-emerald-100">Email: {session.user.email}</p>
              {isAdmin && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-emerald-800"
                  >
                    {showAdminPanel ? "Hide Admin Panel" : "Show Admin Panel"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {isAdmin && showAdminPanel && (
          <div className="mt-8">
            <AdminPanel />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
