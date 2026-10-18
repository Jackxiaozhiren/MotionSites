export function DashboardPreview() {
  return (
    <div
      className="rounded-2xl overflow-hidden p-3 md:p-4 select-none pointer-events-none"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: 'var(--shadow-dashboard)',
      }}
    >
      <div className="bg-background rounded-xl overflow-hidden text-[11px]">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="bg-foreground text-primary-foreground text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center">
              N
            </span>
            <span className="text-[11px] font-semibold">Nexora</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-secondary rounded-md px-2 py-1 text-[10px]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Search
              <span className="text-[9px] bg-background border border-border rounded px-1">⌘K</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium text-foreground">Move Money</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[9px] font-medium flex items-center justify-center">
              JB
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-40 border-r border-border p-2.5 space-y-0.5 text-muted-foreground shrink-0">
            {[
              { label: 'Home', active: true },
              { label: 'Tasks', badge: '10' },
              { label: 'Transactions' },
              { label: 'Payments', chevron: true },
              { label: 'Cards' },
              { label: 'Capital' },
              { label: 'Accounts', chevron: true },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-2 py-1 rounded-md text-[10px] ${
                  item.active
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'hover:bg-secondary'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-foreground text-primary-foreground text-[8px] rounded-full px-1.5 py-0.5">
                    {item.badge}
                  </span>
                )}
                {item.chevron && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )}
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-border">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 mb-1">
                Workflows
              </div>
              {['Trake rutes', 'Payments', 'Notifications', 'Settings'].map((item) => (
                <div
                  key={item}
                  className="flex items-center px-2 py-1 rounded-md text-[10px] hover:bg-secondary"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-secondary/30 p-4 space-y-4 min-w-0">
            {/* Greeting */}
            <div className="text-sm font-semibold">Welcome, Jane</div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {['Send', 'Request', 'Transfer', 'Deposit', 'Pay Bill', 'Create Invoice'].map((label) => (
                <button
                  key={label}
                  className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                    label === 'Send'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground border border-border'
                  }`}
                >
                  {label}
                </button>
              ))}
              <span className="text-[10px] text-muted-foreground ml-1">Customize</span>
            </div>

            {/* Cards Row */}
            <div className="flex gap-3">
              {/* Balance Card */}
              <div className="flex-1 basis-0 bg-background rounded-xl p-3 border border-border">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] mb-2">
                  Mercury Balance
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div className="text-lg font-semibold tracking-tight">
                  $8,450,190
                  <span className="text-xs text-muted-foreground">.32</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[9px] text-muted-foreground">Last 30 Days</span>
                  <span className="text-[9px] text-green-600 font-medium">+$1.8M</span>
                  <span className="text-[9px] text-red-500 font-medium">−$900K</span>
                </div>
                {/* SVG Area Chart */}
                <svg
                  viewBox="0 0 200 60"
                  className="w-full h-16 mt-2"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="hsl(239 84% 67%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 50 C20 48, 40 52, 60 40 C80 28, 100 35, 120 25 C140 15, 160 22, 180 12 C190 7, 198 10, 200 10 L200 60 L0 60 Z"
                    fill="url(#balanceGrad)"
                  />
                  <path
                    d="M0 50 C20 48, 40 52, 60 40 C80 28, 100 35, 120 25 C140 15, 160 22, 180 12 C190 7, 198 10, 200 10"
                    fill="none"
                    stroke="hsl(239 84% 67%)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Accounts Card */}
              <div className="flex-1 basis-0 bg-background rounded-xl p-3 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground font-medium">Accounts</span>
                  <div className="flex items-center gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </div>
                </div>
                {[
                  { name: 'Credit', amount: '$98,125.50' },
                  { name: 'Treasury', amount: '$6,750,200.00' },
                  { name: 'Operations', amount: '$1,592,864.82' },
                ].map((acct) => (
                  <div
                    key={acct.name}
                    className="flex items-center justify-between py-3 text-xs"
                  >
                    <span className="text-muted-foreground">{acct.name}</span>
                    <span className="font-medium tabular-nums">{acct.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions Table */}
            <div>
              <div className="text-xs font-semibold mb-2">Recent Transactions</div>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-muted-foreground border-b border-border">
                    <th className="text-left py-1.5 font-medium">Date</th>
                    <th className="text-left py-1.5 font-medium">Description</th>
                    <th className="text-right py-1.5 font-medium">Amount</th>
                    <th className="text-right py-1.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '12 Jun', desc: 'AWS', amount: '-$5,200', status: 'Pending', statusColor: 'text-amber-600' },
                    { date: '11 Jun', desc: 'Client Payment', amount: '+$125,000', status: 'Completed', statusColor: 'text-green-600' },
                    { date: '10 Jun', desc: 'Payroll', amount: '-$85,450', status: 'Completed', statusColor: 'text-green-600' },
                    { date: '09 Jun', desc: 'Office Supplies', amount: '-$1,200', status: 'Completed', statusColor: 'text-green-600' },
                  ].map((row) => (
                    <tr key={row.date + row.desc} className="border-b border-border/50">
                      <td className="py-1.5 text-muted-foreground">{row.date}</td>
                      <td className="py-1.5">{row.desc}</td>
                      <td className={`py-1.5 text-right tabular-nums ${row.amount.startsWith('+') ? 'text-green-600' : ''}`}>
                        {row.amount}
                      </td>
                      <td className={`py-1.5 text-right ${row.statusColor}`}>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
