# AdFlow AI - AI Marketing Platform

An AI-powered marketing automation platform that generates advertisements using OpenAI and manages campaigns across multiple social media channels.

## 🚀 Features

- **AI Ad Generation**: Create professional ads with GPT-4o powered copy generation
- **Multi-Platform Support**: Deploy to Facebook, Instagram, LinkedIn, Twitter, Google Ads
- **Bilingual Support**: Complete Arabic/English interface with RTL layout
- **Campaign Management**: Full lifecycle campaign management with analytics
- **Subscription Plans**: Stripe-powered pricing tiers (Free, Pro $29, Enterprise $99)
- **Real-time Analytics**: Performance tracking and optimization insights

## 🛠 Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4o for content generation
- **Payments**: Stripe integration
- **Deployment**: Netlify with automatic deployments

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/ahmedhailat/adflow-ai-platform.git
cd adflow-ai-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your API keys to .env
```

4. Start development server:
```bash
npm run dev
```

## 🔧 Environment Variables

```env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

## 🌐 Live Demo

Visit the live platform: [https://gentle-eclair-218500.netlify.app](https://gentle-eclair-218500.netlify.app)

## 📱 Screenshots

### Dashboard
![Dashboard Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=AI+Marketing+Dashboard)

### AI Generator
![AI Generator](https://via.placeholder.com/800x400/764ba2/ffffff?text=AI+Ad+Generator)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4o API
- Stripe for payment processing
- Tailwind CSS for styling
- Shadcn/ui for components