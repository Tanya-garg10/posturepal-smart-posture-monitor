import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Zap, BarChart3, Bell, Lightbulb, Camera } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">PosturePal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:bg-muted">Login</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl font-bold text-foreground leading-tight tracking-tight text-balance">
              Perfect Your Posture in Real-Time
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              AI-powered posture monitoring that detects issues instantly and provides personalized recommendations to build healthier habits.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" className="h-12 px-8 text-base font-semibold border-border hover:bg-muted">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-2">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 bg-muted/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-bold text-foreground tracking-tight">Powerful Features Built for You</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to improve your posture and build lasting healthy habits</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                title: 'Live Monitoring',
                description: 'Real-time posture analysis with AI-powered detection',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Track your progress with detailed insights and heatmaps',
              },
              {
                icon: Bell,
                title: 'Smart Alerts',
                description: 'Get notified instantly when posture issues are detected',
              },
              {
                icon: Lightbulb,
                title: 'Personalized Tips',
                description: 'AI-generated recommendations tailored to your needs',
              },
              {
                icon: Zap,
                title: 'Instant Feedback',
                description: 'Real-time corrections with visual and audio cues',
              },
              {
                icon: BarChart3,
                title: 'Progress Tracking',
                description: 'Weekly and monthly analytics to celebrate your wins',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-14 h-14 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-foreground text-center mb-20 tracking-tight">Why Choose PosturePal?</h2>

          <div className="space-y-4">
            {[
              'Reduce back and neck pain with proper posture alignment',
              'Improve productivity and focus throughout your workday',
              'Prevent long-term musculoskeletal injuries',
              'Get personalized exercises based on your posture patterns',
              'Join thousands of satisfied users improving their health',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/40 transition-colors">
                <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-lg text-foreground leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-28 bg-muted/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-bold text-foreground tracking-tight">Loved by Users</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">See what our community is saying about their posture transformation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'Software Engineer',
                quote: 'PosturePal has been a game-changer for my back pain. I can finally focus on work without constant discomfort!',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
              },
              {
                name: 'James Rodriguez',
                role: 'Student',
                quote: 'The real-time alerts keep me accountable. My posture has improved dramatically in just 2 weeks.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
              },
              {
                name: 'Emily Watson',
                role: 'Freelancer',
                quote: 'I love the personalized recommendations. They feel like having a personal trainer watching over me.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-card rounded-xl p-8 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-5">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed text-sm">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/8 via-background to-secondary/8">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-foreground tracking-tight">Ready to Transform Your Posture?</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">Join thousands of users already experiencing better health and productivity with PosturePal</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 h-13 px-10 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">PosturePal</span>
              </div>
              <p className="text-sm text-white/60">AI-powered posture monitoring for better health and productivity.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-sm text-center text-white/60">
            <p>&copy; 2024 PosturePal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
