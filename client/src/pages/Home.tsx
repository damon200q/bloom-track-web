import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("fertility");
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [result, setResult] = useState<any>(null);

  const calculateFertility = () => {
    if (!lastPeriod) {
      alert("Please select a date");
      return;
    }

    const lastDate = new Date(lastPeriod);
    const nextPeriodDate = new Date(lastDate);
    nextPeriodDate.setDate(lastDate.getDate() + cycleLength);

    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(nextPeriodDate.getDate() - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    const safeStart = new Date(lastDate);
    safeStart.setDate(lastDate.getDate() + 1);
    const safeEnd = new Date(fertileStart);
    safeEnd.setDate(fertileStart.getDate() - 1);

    setResult({
      nextPeriod: nextPeriodDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      ovulationDay: ovulationDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      fertileWindow: `${fertileStart.toLocaleDateString("en-US", { month: "long", day: "numeric" })} to ${fertileEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      safePeriod: `${safeStart.toLocaleDateString("en-US", { month: "long", day: "numeric" })} to ${safeEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fef3f5 0%, #fde2e6 50%, #fef3f5 100%)",
      padding: "2rem 1rem",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", marginBottom: "1.5rem" }}>
            <svg style={{ width: "2.5rem", height: "2.5rem", color: "#ff6b9d", marginRight: "0.5rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: 0 }}>
              <span style={{ color: "#1f2937" }}>Bloom</span>
              <span style={{ color: "#ff6b9d" }}>Track</span>
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#6b7280", maxWidth: "42rem", margin: "0 auto" }}>
            Understand your body's natural rhythm with our beautiful, simple fertility calculator.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          padding: "0.5rem",
          marginBottom: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          {[
            { id: "fertility", icon: "🌸", label: "Fertility Tracker" },
            { id: "pregnancy", icon: "🤰", label: "Due Date" },
            { id: "weight", icon: "📊", label: "Weight Tracker" },
            { id: "postpartum", icon: "💪", label: "Postpartum" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: "1 1 140px",
                padding: "1rem 1.25rem",
                borderRadius: "1rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                background: activeTab === tab.id 
                  ? "linear-gradient(to right, #fb7185, #ec4899)" 
                  : "transparent",
                color: activeTab === tab.id ? "white" : "#6b7280",
                boxShadow: activeTab === tab.id ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{tab.icon}</span>
                <span style={{ fontSize: "0.875rem" }}>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          padding: "2.5rem",
          border: "1px solid rgba(251, 113, 133, 0.1)"
        }}>
          {activeTab === "fertility" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
                <div style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  background: "linear-gradient(135deg, #fb7185, #ec4899)",
                  borderRadius: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "1rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}>
                  <span style={{ fontSize: "2rem", color: "white" }}>🌸</span>
                </div>
                <div>
                  <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>
                    Fertility & Ovulation Tracker
                  </h2>
                  <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
                    Track your cycle and find your most fertile days
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.75rem" }}>
                  First Day of Last Period
                </label>
                <input
                  type="date"
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "#fef2f3",
                    border: "2px solid #fecdd3",
                    borderRadius: "0.75rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    outline: "none",
                    transition: "all 0.3s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#fb7185"}
                  onBlur={(e) => e.target.style.borderColor = "#fecdd3"}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.75rem" }}>
                  Average Cycle Length (days)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    min="22"
                    max="45"
                    style={{
                      width: "100%",
                      padding: "1rem",
                      background: "#fef2f3",
                      border: "2px solid #fecdd3",
                      borderRadius: "0.75rem",
                      fontSize: "1rem",
                      fontWeight: "500",
                      outline: "none"
                    }}
                  />
                  <span style={{ position: "absolute", right: "1rem", top: "1rem", color: "#9ca3af", fontSize: "0.875rem" }}>
                    22-45 days
                  </span>
                </div>
              </div>

              <button
                onClick={calculateFertility}
                style={{
                  width: "100%",
                  padding: "1.25rem",
                  background: "linear-gradient(to right, #ec4899, #f472b6)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.125rem",
                  border: "none",
                  borderRadius: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }}
              >
                ✨ Calculate My Cycle
              </button>

              {result && (
                <div style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
                  <div style={{
                    background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
                    borderLeft: "4px solid #f87171",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "start"
                  }}>
                    <div style={{
                      width: "3rem",
                      height: "3rem",
                      background: "#fee2e2",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      flexShrink: 0
                    }}>
                      <svg style={{ width: "1.5rem", height: "1.5rem", color: "#f87171" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#374151", margin: "0 0 0.25rem 0" }}>
                        Next Period Expected
                      </h3>
                      <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", margin: 0 }}>
                        {result.nextPeriod}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                    borderLeft: "4px solid #10b981",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "start"
                  }}>
                    <div style={{
                      width: "3rem",
                      height: "3rem",
                      background: "#d1fae5",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      flexShrink: 0
                    }}>
                      <svg style={{ width: "1.5rem", height: "1.5rem", color: "#10b981" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#374151", margin: "0 0 0.25rem 0" }}>
                        ⭐ Best Conception Day (Peak Ovulation)
                      </h3>
                      <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", margin: "0 0 0.25rem 0" }}>
                        {result.ovulationDay}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                        Highest conception probability - optimal timing!
                      </p>
                    </div>
                  </div>

                  <div style={{
                    background: "linear-gradient(135deg, #fefce8, #fef3c7)",
                    borderLeft: "4px solid #fbbf24",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "start"
                  }}>
                    <div style={{
                      width: "3rem",
                      height: "3rem",
                      background: "#fef3c7",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      flexShrink: 0
                    }}>
                      <svg style={{ width: "1.5rem", height: "1.5rem", color: "#fbbf24" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#374151", margin: "0 0 0.25rem 0" }}>
                        Fertile Window (High Conception Days)
                      </h3>
                      <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", margin: "0 0 0.25rem 0" }}>
                        {result.fertileWindow}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                        Increased chances of getting pregnant
                      </p>
                    </div>
                  </div>

                  <div style={{
                    background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                    borderLeft: "4px solid #3b82f6",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "start"
                  }}>
                    <div style={{
                      width: "3rem",
                      height: "3rem",
                      background: "#dbeafe",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      flexShrink: 0
                    }}>
                      <svg style={{ width: "1.5rem", height: "1.5rem", color: "#3b82f6" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#374151", margin: "0 0 0.25rem 0" }}>
                        Relative Safe Period
                      </h3>
                      <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", margin: "0 0 0.25rem 0" }}>
                        {result.safePeriod}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                        ⚠️ Not a reliable contraception method
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab !== "fertility" && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#6b7280", marginBottom: "1rem" }}>
                {activeTab === "pregnancy" && "🤰 Due Date Calculator"}
                {activeTab === "weight" && "📊 Weight Tracker"}
                {activeTab === "postpartum" && "💪 Postpartum Care"}
              </h3>
              <p style={{ color: "#9ca3af" }}>Coming soon! This feature is under development.</p>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div style={{
          marginTop: "3rem",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "0.875rem",
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem", fontWeight: "600" }}>
            <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Important Information</span>
          </div>
          <p style={{ margin: 0 }}>
            This tool provides general estimates and information. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with your healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
}