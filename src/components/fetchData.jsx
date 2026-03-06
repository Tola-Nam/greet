import { useState } from "react";

const TABLE_WIDTH = 220;
const HEADER_H = 40;
const ROW_H = 26;

const tables = [
  {
    id: "users",
    name: "Users",
    icon: "👤",
    desc: "System user accounts & roles",
    color: "#6366f1",
    x: 30,
    y: 30,
    fields: [
      { name: "ID", type: "INT", pk: true },
      { name: "Name", type: "VARCHAR" },
      { name: "Role", type: "ENUM" },
      { name: "Email", type: "VARCHAR" },
      { name: "PasswordHash", type: "VARCHAR" },
    ],
  },
  {
    id: "customers",
    name: "Customers",
    icon: "🏢",
    desc: "Client companies & credit balance",
    color: "#0ea5e9",
    x: 420,
    y: 30,
    fields: [
      { name: "ID", type: "INT", pk: true },
      { name: "Name", type: "VARCHAR" },
      { name: "Phone", type: "VARCHAR" },
      { name: "AvailableCreditBalance", type: "DECIMAL" },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    icon: "📁",
    desc: "Project lifecycle & Kanban status",
    color: "#10b981",
    x: 810,
    y: 30,
    fields: [
      { name: "ID", type: "INT", pk: true },
      { name: "Name", type: "VARCHAR" },
      { name: "CustomerID", type: "INT", fk: true, ref: "Customers.ID" },
      { name: "Status", type: "ENUM" },
      { name: "Progress", type: "INT" },
      { name: "LastUpdate", type: "TIMESTAMP" },
    ],
  },
  {
    id: "salesdocuments",
    name: "Sales Documents",
    icon: "📄",
    desc: "Quotes, POs, SOs & Invoices",
    color: "#f59e0b",
    x: 30,
    y: 360,
    fields: [
      { name: "ID", type: "INT", pk: true },
      { name: "Type", type: "ENUM", note: "Quote/PO/SO/Inv" },
      { name: "CustomerID", type: "INT", fk: true, ref: "Customers.ID" },
      { name: "ProjectID", type: "INT", fk: true, ref: "Projects.ID" },
      { name: "Date", type: "DATE" },
      { name: "DueDate", type: "DATE" },
      { name: "Amount", type: "DECIMAL" },
      { name: "Discount", type: "DECIMAL" },
      { name: "BalanceDue", type: "DECIMAL" },
      { name: "Status", type: "ENUM" },
    ],
  },
  {
    id: "salesdocumentitems",
    name: "Document Items",
    icon: "🧾",
    desc: "Line items for each document",
    color: "#ef4444",
    x: 420,
    y: 360,
    fields: [
      { name: "ID", type: "INT", pk: true },
      { name: "DocumentID", type: "INT", fk: true, ref: "SalesDocuments.ID" },
      { name: "Description", type: "TEXT" },
      { name: "Qty", type: "INT" },
      { name: "UnitPrice", type: "DECIMAL" },
      { name: "Total", type: "DECIMAL" },
    ],
  },
  {
    id: "expenses",
    name: "Expenses",
    icon: "💸",
    desc: "Project costs & vendor payments",
    color: "#8b5cf6",
    x: 810,
    y: 360,
    fields: [
      { name: "ID", type: "INT", pk: true },
      { name: "ProjectID", type: "INT", fk: true, ref: "Projects.ID" },
      { name: "VendorName", type: "VARCHAR" },
      { name: "Category", type: "ENUM", note: "Materials/Labor/..." },
      { name: "Date", type: "DATE" },
      { name: "Amount", type: "DECIMAL" },
      { name: "Status", type: "ENUM", note: "Unpaid/Paid" },
    ],
  },
  {
    id: "ledgertransactions",
    name: "Ledger Transactions",
    icon: "📒",
    desc: "Payments, prepayments & refunds",
    color: "#ec4899",
    x: 30,
    y: 700,
    fields: [
      { name: "ID", type: "INT", pk: true },
      { name: "CustomerID", type: "INT", fk: true, ref: "Customers.ID" },
      { name: "Date", type: "DATE" },
      { name: "Type", type: "ENUM", note: "Payment/Prepay/Refund" },
      { name: "Amount", type: "DECIMAL" },
      {
        name: "ReferenceDocID",
        type: "INT",
        fk: true,
        ref: "SalesDocuments.ID",
      },
    ],
  },
];

const relationships = [
  {
    from: "customers",
    to: "projects",
    fromField: "ID",
    toField: "CustomerID",
    label: "1 Customer → Many Projects",
  },
  {
    from: "customers",
    to: "salesdocuments",
    fromField: "ID",
    toField: "CustomerID",
    label: "1 Customer → Many Documents",
  },
  {
    from: "customers",
    to: "ledgertransactions",
    fromField: "ID",
    toField: "CustomerID",
    label: "1 Customer → Many Transactions",
  },
  {
    from: "projects",
    to: "salesdocuments",
    fromField: "ID",
    toField: "ProjectID",
    label: "1 Project → Many Documents",
  },
  {
    from: "projects",
    to: "expenses",
    fromField: "ID",
    toField: "ProjectID",
    label: "1 Project → Many Expenses",
  },
  {
    from: "salesdocuments",
    to: "salesdocumentitems",
    fromField: "ID",
    toField: "DocumentID",
    label: "1 Document → Many Line Items",
  },
  {
    from: "salesdocuments",
    to: "ledgertransactions",
    fromField: "ID",
    toField: "ReferenceDocID",
    label: "1 Document → Many Transactions",
  },
];

function getTableH(t) {
  return HEADER_H + 22 + t.fields.length * ROW_H + 8;
}

function getMidY(t, fieldName) {
  const idx = t.fields.findIndex((f) => f.name === fieldName);
  return t.y + HEADER_H + 22 + idx * ROW_H + ROW_H / 2;
}

function buildPath(fromT, toT, fromField, toField) {
  const fy = getMidY(fromT, fromField);
  const ty = getMidY(toT, toField);
  const fRight = fromT.x + TABLE_WIDTH;
  const fLeft = fromT.x;
  const tRight = toT.x + TABLE_WIDTH;
  const tLeft = toT.x;

  let x1, x2, c1x, c2x;
  if (fRight + 10 <= tLeft) {
    x1 = fRight;
    x2 = tLeft;
    c1x = x1 + 70;
    c2x = x2 - 70;
  } else if (tRight + 10 <= fLeft) {
    x1 = fLeft;
    x2 = tRight;
    c1x = x1 - 70;
    c2x = x2 + 70;
  } else if (fromT.x < toT.x) {
    x1 = fRight;
    x2 = tLeft;
    c1x = x1 + 70;
    c2x = x2 - 70;
  } else {
    x1 = fLeft;
    x2 = tRight;
    c1x = x1 - 70;
    c2x = x2 + 70;
  }

  return { x1, y1: fy, x2, y2: ty, c1x, c2x };
}

export default function ERD() {
  const [hovered, setHovered] = useState(null);
  const [activeRel, setActiveRel] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const CANVAS_W = 1060;
  const CANVAS_H = 980;

  const relColors = [
    "#6366f1",
    "#0ea5e9",
    "#ec4899",
    "#10b981",
    "#8b5cf6",
    "#ef4444",
    "#f59e0b",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: "20px 16px 40px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        .tbl { cursor: pointer; transition: all 0.18s; }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 5,
            color: "#6366f1",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Database Schema
        </div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#f1f5f9",
            margin: 0,
          }}
        >
          Daikou OOS — Entity Relationship Diagram
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: "6px 0 0" }}>
          7 tables · 7 relationships · Hover tables and lines to explore
        </p>
      </div>

      {/* Legend row */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 16,
          padding: "10px 20px",
          background: "#161b27",
          borderRadius: 10,
          border: "1px solid #1e293b",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          {
            icon: "🔑",
            color: "#facc15",
            bg: "#facc1520",
            label: "PK = Primary Key (unique row ID)",
          },
          {
            icon: "🔗",
            color: "#7dd3fc",
            bg: "#7dd3fc20",
            label: "FK = Foreign Key (links to another table)",
          },
          {
            icon: "📦",
            color: "#94a3b8",
            bg: "#94a3b815",
            label: "Regular attribute / field",
          },
          {
            icon: "〰️",
            color: "#6366f1",
            bg: "transparent",
            label: "Relationship line (hover to read)",
          },
        ].map((l) => (
          <div
            key={l.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            <span style={{ fontSize: 14 }}>{l.icon}</span>
            <span
              style={{
                background: l.bg,
                color: l.color,
                padding: "1px 7px",
                borderRadius: 4,
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              {l.label.split("=")[0].trim()}
            </span>
            <span style={{ color: "#475569" }}>
              = {l.label.split("=")[1]?.trim()}
            </span>
          </div>
        ))}
      </div>

      {/* Relationship hover tooltip */}
      {activeRel !== null && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 100,
            background: "#1e293b",
            border: `2px solid ${relColors[activeRel]}`,
            borderRadius: 10,
            padding: "10px 16px",
            maxWidth: 260,
            boxShadow: `0 0 20px ${relColors[activeRel]}44`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: relColors[activeRel],
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            RELATIONSHIP
          </div>
          <div style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>
            {relationships[activeRel].label}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            {relationships[activeRel].from}{" "}
            <span style={{ color: relColors[activeRel] }}>→</span>{" "}
            {relationships[activeRel].to}
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div
        style={{ overflowX: "auto", width: "100%", maxWidth: CANVAS_W + 40 }}
      >
        <svg
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: "block", margin: "0 auto" }}
        >
          <defs>
            {relColors.map((c, i) => (
              <marker
                key={i}
                id={`arr-${i}`}
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,0 L0,7 L9,3.5 z" fill={c} />
              </marker>
            ))}
            <marker
              id="arr-dim"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L0,7 L7,3.5 z" fill="#334155" />
            </marker>
          </defs>

          {/* Relationship lines */}
          {relationships.map((rel, i) => {
            const fromT = tables.find((t) => t.id === rel.from);
            const toT = tables.find((t) => t.id === rel.to);
            if (!fromT || !toT) return null;
            const pts = buildPath(fromT, toT, rel.fromField, rel.toField);
            const isActive = activeRel === i;
            const isDimmed = activeRel !== null && !isActive;
            const c = relColors[i];

            return (
              <g
                key={i}
                onMouseEnter={() => setActiveRel(i)}
                onMouseLeave={() => setActiveRel(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Thicker invisible hit area */}
                <path
                  d={`M${pts.x1},${pts.y1} C${pts.c1x},${pts.y1} ${pts.c2x},${pts.y2} ${pts.x2},${pts.y2}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={14}
                />
                {/* Visible line */}
                <path
                  d={`M${pts.x1},${pts.y1} C${pts.c1x},${pts.y1} ${pts.c2x},${pts.y2} ${pts.x2},${pts.y2}`}
                  fill="none"
                  stroke={isDimmed ? "#1e2a3a" : isActive ? c : "#2d4a6a"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={isActive ? "none" : "7 4"}
                  markerEnd={isDimmed ? "url(#arr-dim)" : `url(#arr-${i})`}
                  opacity={isDimmed ? 0.3 : 1}
                />
                {/* Midpoint label bubble */}
                {isActive &&
                  (() => {
                    const mx = (pts.x1 + pts.x2) / 2;
                    const my = (pts.y1 + pts.y2) / 2;
                    return (
                      <g>
                        <rect
                          x={mx - 18}
                          y={my - 12}
                          width={36}
                          height={20}
                          rx={5}
                          fill={c}
                          opacity={0.9}
                        />
                        <text
                          x={mx}
                          y={my + 3}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize={10}
                          fontWeight="700"
                          fontFamily="Inter, sans-serif"
                        >
                          1 : N
                        </text>
                      </g>
                    );
                  })()}
              </g>
            );
          })}

          {/* Tables */}
          {tables.map((table) => {
            const h = getTableH(table);
            const isHov = hovered === table.id;

            return (
              <g
                key={table.id}
                className="tbl"
                onMouseEnter={() => setHovered(table.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  filter: isHov
                    ? `drop-shadow(0 0 18px ${table.color}66) drop-shadow(0 4px 16px #00000099)`
                    : `drop-shadow(0 2px 10px #00000077)`,
                }}
              >
                {/* Shadow base */}
                <rect
                  x={table.x + 3}
                  y={table.y + 3}
                  width={TABLE_WIDTH}
                  height={h}
                  rx={10}
                  fill="#000"
                  opacity={0.3}
                />

                {/* Card body */}
                <rect
                  x={table.x}
                  y={table.y}
                  width={TABLE_WIDTH}
                  height={h}
                  rx={10}
                  fill="#161b27"
                  stroke={isHov ? table.color : "#1e293b"}
                  strokeWidth={isHov ? 2 : 1}
                />

                {/* Header bar */}
                <rect
                  x={table.x}
                  y={table.y}
                  width={TABLE_WIDTH}
                  height={HEADER_H + 2}
                  rx={10}
                  fill={table.color}
                />
                <rect
                  x={table.x}
                  y={table.y + HEADER_H - 2}
                  width={TABLE_WIDTH}
                  height={10}
                  fill={table.color}
                />

                {/* Table icon + name */}
                <text
                  x={table.x + 12}
                  y={table.y + 26}
                  fontSize={18}
                  fontFamily="Segoe UI Emoji, sans-serif"
                >
                  {table.icon}
                </text>
                <text
                  x={table.x + 36}
                  y={table.y + 26}
                  fill="#fff"
                  fontSize={13}
                  fontWeight="700"
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {table.name}
                </text>

                {/* Desc subtitle */}
                <text
                  x={table.x + 10}
                  y={table.y + HEADER_H + 15}
                  fill="#475569"
                  fontSize={9.5}
                  fontFamily="Inter, sans-serif"
                  fontStyle="italic"
                >
                  {table.desc}
                </text>

                {/* Divider */}
                <line
                  x1={table.x + 6}
                  y1={table.y + HEADER_H + 20}
                  x2={table.x + TABLE_WIDTH - 6}
                  y2={table.y + HEADER_H + 20}
                  stroke="#1e293b"
                  strokeWidth={1}
                />

                {/* Fields */}
                {table.fields.map((field, fi) => {
                  const fy = table.y + HEADER_H + 24 + fi * ROW_H;
                  const isPK = field.pk;
                  const isFK = field.fk;

                  return (
                    <g key={field.name}>
                      {/* Row hover bg (alternating) */}
                      {fi % 2 === 0 && (
                        <rect
                          x={table.x + 1}
                          y={fy}
                          width={TABLE_WIDTH - 2}
                          height={ROW_H}
                          fill="#ffffff05"
                          rx={2}
                        />
                      )}

                      {/* PK/FK badge */}
                      <rect
                        x={table.x + 8}
                        y={fy + 5}
                        width={22}
                        height={15}
                        rx={4}
                        fill={
                          isPK ? "#facc1530" : isFK ? "#7dd3fc25" : "#ffffff08"
                        }
                      />
                      <text
                        x={table.x + 19}
                        y={fy + 16}
                        textAnchor="middle"
                        fill={isPK ? "#facc15" : isFK ? "#7dd3fc" : "#334155"}
                        fontSize={8.5}
                        fontWeight="700"
                        fontFamily="Inter, sans-serif"
                      >
                        {isPK ? "PK" : isFK ? "FK" : "  "}
                      </text>

                      {/* Field name */}
                      <text
                        x={table.x + 36}
                        y={fy + 17}
                        fill={isPK ? "#fef3c7" : isFK ? "#bae6fd" : "#cbd5e1"}
                        fontSize={11}
                        fontFamily="Inter, sans-serif"
                        fontWeight={isPK || isFK ? "600" : "400"}
                      >
                        {field.name}
                      </text>

                      {/* Data type badge */}
                      <rect
                        x={table.x + TABLE_WIDTH - 52}
                        y={fy + 5}
                        width={44}
                        height={14}
                        rx={3}
                        fill={isPK ? "#facc1515" : "#0f172a"}
                      />
                      <text
                        x={table.x + TABLE_WIDTH - 30}
                        y={fy + 15.5}
                        textAnchor="middle"
                        fill={isPK ? "#facc1599" : "#334155"}
                        fontSize={8.5}
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        {field.type}
                      </text>

                      {/* FK reference tooltip inline */}
                      {isFK && isHov && (
                        <text
                          x={table.x + 36}
                          y={fy + 26}
                          fill="#334155"
                          fontSize={8}
                          fontFamily="Inter, sans-serif"
                          fontStyle="italic"
                        >
                          → {field.ref}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Bottom module tag */}
                <rect
                  x={table.x + TABLE_WIDTH - 8 - 12}
                  y={table.y + h - 18}
                  width={12}
                  height={12}
                  rx={6}
                  fill={table.color}
                  opacity={0.6}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Table index */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 10,
          marginTop: 20,
          width: "100%",
          maxWidth: 1060,
        }}
      >
        {tables.map((t) => (
          <div
            key={t.id}
            onMouseEnter={() => setHovered(t.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 8,
              background: hovered === t.id ? t.color + "22" : "#161b27",
              border: `1px solid ${hovered === t.id ? t.color : "#1e293b"}`,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>
                {t.name}
              </div>
              <div style={{ fontSize: 10, color: "#475569" }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 10,
          color: "#1e293b",
          letterSpacing: 3,
        }}
      >
        DAIKOU SOFTWARE OOS · ERD v2
      </div>
    </div>
  );
}
