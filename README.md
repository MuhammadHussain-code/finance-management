# SIP Tracker (PWA)

Personal finance tracker for SIP and lump-sum investments with manual price updates, deterministic calculations, and a standalone SIP calculator. Built with Vite, React, Tailwind CSS, shadcn/ui, and Supabase.

## 🚀 Quick Start

**New to the project?** Start with **[QUICKSTART.md](./QUICKSTART.md)** for a step-by-step checklist.

**Need detailed instructions?** See **[SETUP.md](./SETUP.md)** for comprehensive setup guide.

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://app.supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Run `supabase/seed.sql` to insert asset categories
4. Get your project URL and anon key from Settings → API

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and create your account!

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide with troubleshooting
- **[Plan](./.cursor/plans/sip_finance_tracker_b888cca6.plan.md)** - Architecture and design decisions

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── app/              # App shell, routes, providers
├── components/       # Reusable UI components (shadcn/ui)
├── features/         # Feature modules
│   ├── auth/        # Authentication
│   ├── assets/       # Asset management
│   ├── investments/ # Investment tracking
│   ├── calculations/# Financial calculations (XIRR, returns)
│   └── sip-calculator/ # SIP projection tool
├── lib/              # Utilities, Supabase client
├── pages/            # Page components
└── types/            # Shared TypeScript types
```

## ✨ Features

- ✅ **Asset Management** - Create and track multiple investment instruments
- ✅ **Investment Logging** - Record SIP and lump-sum entries with backdating
- ✅ **Price Updates** - Manual price tracking with history
- ✅ **Performance Metrics** - Automatic calculation of returns, XIRR, and portfolio value
- ✅ **SIP Calculator** - Standalone projection tool (non-persistent)
- ✅ **Mobile-First PWA** - Installable app with offline support
- ✅ **Secure** - Row-level security ensures data isolation per user

## 🔒 Security

- All database operations use Supabase Row-Level Security (RLS)
- User data is strictly isolated
- Authentication handled by Supabase Auth

## 📝 Notes

- **Phase 1**: Manual price entry (current)
- **Phase 2 Ready**: Architecture supports automated price fetching
- SIP calculator does not store data (by design)
- All calculations are deterministic and audit-friendly

## 🐛 Troubleshooting

See [SETUP.md](./SETUP.md) for common issues and solutions.

## 📄 License

Private project - All rights reserved
