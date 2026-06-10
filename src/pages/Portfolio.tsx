import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ExperienceItem from '@/components/ExperienceItem';
import ProjectItem from '@/components/ProjectItem';
import RotatingQuote from '@/components/RotatingQuote';
import TerminalMode from '@/components/TerminalMode';
import HiddenTarget from '@/components/HiddenTarget';
import ProfilePhoto from '@/components/ProfilePhoto';
import ScrollReveal from '@/components/ScrollReveal';
const Portfolio = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  return <div className="min-h-screen bg-background">
      <Sidebar onOpenTerminal={() => setTerminalOpen(true)} />
      <ScrollReveal />
      {terminalOpen && <TerminalMode onClose={() => setTerminalOpen(false)} />}

      {/* Main content — bottom padding clears the ticker tape */}
      <div className="lg:ml-80 min-h-screen pb-10">
        <div className="max-w-4xl p-4 sm:p-8 lg:p-12">
          {/* About Section */}
          <section id="about" className="mb-16">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="lg:w-1/2">
                <ProfilePhoto />
                <p className="text-sm text-muted-foreground mt-2 italic">Aryan Choudhari</p>
              </div>
              
              <div className="lg:w-1/2 space-y-4">
                <p className="text-base leading-relaxed">
                  Hi! I'm an ISYE major at Georgia Tech concentrating on Economic and Financial Systems. 
                  I'm really interested in finance and business, and I'm currently working in my family's 
                  manufacturing business — learning how the whole operation runs from the ground up. 
                  Long term, I'm focused on growing into and helping carry that business forward.
                </p>
              </div>
            </div>
          </section>

          {/* I think about this often */}
          <section className="mb-16">
            <RotatingQuote />
          </section>

          {/* Currently Optimizing */}
          <section className="mb-16 relative">
            <h2 className="text-2xl font-serif font-bold mb-4">Currently Optimizing</h2>
            <p className="text-3xl font-serif italic leading-none">life.</p>
            <p className="text-xs text-muted-foreground mt-3 italic">subject to constraints.</p>
            <HiddenTarget size={26} shardCount={22} wrapperClassName="absolute top-0 right-2" />
          </section>

          {/* Experience Section */}
          <section id="experience" className="mb-16">
            <h2 className="text-2xl font-serif font-bold mb-8">Experience</h2>
            
            <ExperienceItem title="Research Analyst" company="Georgia Tech Venture Capital Club" period="Aug 2025 – Present" description="Collaborated in a 5-member analyst team to evaluate 10+ supply-chain startups across market size, management quality, and financial viability for a consolidated sector report; edited and proofread 15+ research documents prior to club-wide distribution." />
            
            <ExperienceItem title="Investments Intern" company="Venture Catalysts Limited" period="May 2025 – Aug 2025" description="Prepared performance reports for portfolio companies detailing asset allocation and financial performance using advanced Excel; conducted 15+ startup evaluations using EBITDA, P/E ratios, and peer benchmarking to support internal review discussions." />
            
            <ExperienceItem title="Operations Intern" company="SB Plastech (India's Leading FIBC Manufacturer)" period="May 2024 – Aug 2024" description="Conducted technical analysis across 3 operational systems and 5+ production metrics, including time studies, inventory turnover, and cycle times; built 2 management dashboards to identify recurring bottlenecks and efficiency gaps." />
            
            <ExperienceItem title="Supply Chain & Safety Intern" company="Murugappa Group – Tube Investments of India" period="May 2023 – Aug 2023" description="Gained hands-on experience in precision tube manufacturing and quality control; authored a project report optimizing production efficiency using PDCA and Total Quality Management (TQM) methods." />
          </section>

          {/* Projects Section */}
          <section id="projects" className="mb-16">
            <h2 className="text-2xl font-serif font-bold mb-8">Projects</h2>
            
            <ProjectItem title="Multi-Linear Regression — Predicting Car Mileage" technologies="Linear Regression, Minitab, Mallows' Cp, Durbin-Watson" date="Jan 2025 – Apr 2025" description="Built a multiple linear regression model on the 1999 Car Buyers Guide dataset (n=138) to predict city mileage from weight, horsepower, displacement, and transmission type; performed best-subsets regression using Mallows' Cp for variable selection, diagnosed assumptions via residual analysis and the Durbin-Watson test, and introduced a quadratic Weight² term that improved R² from 76.7% to 83.3% after removing high-leverage outliers." />

            <ProjectItem title="Housing Market Analysis | Georgia Tech" technologies="Python, Pandas, Statistical Analysis, Data Visualization" date="Aug 2024 – Dec 2024" description="Investigated the relationship between interest rates, unemployment, and Connecticut housing sales (inspired by The Big Short and macroeconomic theory); cleaned and integrated multi-source datasets (CSV, HTML, JSON; >125MB) from government portals, calculated correlation coefficients and elasticity metrics to evaluate residential vs. commercial volatility across recessions, and built affordability indices revealing a 500% rise in sale-to-interest rate ratios from 2001 to 2021." />

            <ProjectItem title="Budget Allocation Optimization for Large Cap Companies" technologies="Multivariable Calculus, Linear Algebra, Cobb-Douglas" date="Aug 2025" description="Modelled a company's revenue using a Cobb-Douglas production function based on historical data, then applied the method of Lagrange multipliers to add constraints and optimize the budget." />

            <ProjectItem title="Healthcare Go-to-Market Strategy" technologies="Sales Strategy, SalesQB, Market Research" date="Oct 2024" description="Developed 2 targeted sales decks for 4 buyer segments (distributors, wholesalers, urgent care, virtual care), aligning messaging to buyer needs; identified 15–20 companies and 25 target accounts to grow the SMB healthcare pipeline." />
          </section>

          {/* Education Section */}
          <section id="education" className="mb-16 relative">
            <h2 className="text-2xl font-serif font-bold mb-8">Education</h2>
            <HiddenTarget size={22} shardCount={20} wrapperClassName="absolute top-1 right-2" />
            
            <div className="mb-8">
              <h4 className="text-base font-medium mb-1">Bachelor of Science in Industrial Engineering</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Georgia Institute of Technology • 4.0 GPA, Faculty Honors • Expected Graduation: May 2027
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Relevant Coursework: Startup Lab, Finance & Investments, Optimization, Simulation, 
                Stochastic Manufacturing & Service Systems, Supply Chain Economics, Regression & Forecasting, 
                Data Manipulation, Statistics, Python
              </p>
            </div>
          </section>

          {/* Technical Skills Section */}
          <section className="mb-16 relative">
            <h2 className="text-2xl font-serif font-bold mb-8">Technical Skills</h2>
            <HiddenTarget size={30} shardCount={24} wrapperClassName="absolute top-1 right-2" />
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Languages:</h4>
                <p className="text-sm text-muted-foreground">
                  Python (Data Manipulation, Web Scraping), SQL, JavaScript, HTML/CSS
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Libraries:</h4>
                <p className="text-sm text-muted-foreground">
                  pandas, NumPy, Matplotlib, Seaborn, SciPy, scikit-learn
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-16">
            <h2 className="text-2xl font-serif font-bold mb-8">Contact</h2>
            
            <div className="space-y-2">
              <p>
                <a href="mailto:me@aryanc.in" className="portfolio-link">
                  me@aryanc.in
                </a>
              </p>
              <p>
                <a href="https://www.linkedin.com/in/aryanchoudhari" className="portfolio-link">
                  linkedin.com/in/aryanchoudhari
                </a>
              </p>
            </div>
          </section>

          {/* I like these people's work */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-bold mb-8">I like these people's work</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p>Steve Jobs</p>
                <p>Gautam Adani</p>
              </div>
              <div className="space-y-2">
                <p>Mukesh Ambani</p>
              </div>
            </div>
          </section>

          {/* Hidden target */}
          <HiddenTarget />
        </div>
      </div>
    </div>;
};
export default Portfolio;