import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" data-oid="6bubuqy">
      <header
        className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        data-oid="z-762no"
      >
        <div
          className="container flex h-16 items-center justify-between"
          data-oid="::k3_w7"
        >
          <div
            className="font-semibold text-lg tracking-tight"
            data-oid="hov.u39"
          >
            Motors Stock Manager
          </div>
          <div className="flex items-center gap-2" data-oid="h544b0l">
            <ThemeToggle data-oid="crrvrxw" />
            <Button onClick={() => navigate("/login")} data-oid="7-24vck">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden" data-oid="ztpct7o">
        <section className="py-20 sm:py-32" data-oid="1uxxb7l">
          <div className="container px-4 md:px-6" data-oid="dz32exg">
            <div
              className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]"
              data-oid="..i-onm"
            >
              <div
                className="flex flex-col justify-center space-y-4 animate-slideUp"
                data-oid="x:ivjxx"
              >
                <div className="space-y-2" data-oid="029xawp">
                  <h1
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                    data-oid="_:x0:w2"
                  >
                    Streamline Your Vehicle Inventory Management
                  </h1>
                  <p
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                    data-oid="n868e9f"
                  >
                    Efficiently manage automotive stock with real-time updates.
                    Designed specifically for internal teams to track inventory
                    with precision and ease.
                  </p>
                </div>
                <div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  data-oid="6zbdurd"
                >
                  <Button
                    onClick={() => navigate("/login")}
                    size="lg"
                    className="h-12"
                    data-oid="heb.3xk"
                  >
                    Get Started
                  </Button>
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    size="lg"
                    className="h-12"
                    data-oid="s.9rf2x"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div
                className="mx-auto flex w-full items-center justify-center"
                data-oid="xx9acas"
              >
                <div
                  className="relative aspect-video w-full rounded-xl bg-muted overflow-hidden shadow-xl animate-fadeIn animation-delay-300"
                  data-oid="6jhd-l2"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/0 to-primary/5"
                    data-oid="a_0z6cm"
                  ></div>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    data-oid="y4kmu6v"
                  >
                    <div
                      className="space-y-4 p-6 text-center"
                      data-oid="719jbs7"
                    >
                      <div
                        className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
                        data-oid="dqx1yjf"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-8 w-8"
                          data-oid="efim88f"
                        >
                          <path
                            d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"
                            data-oid="yulnsmx"
                          ></path>
                          <circle
                            cx="7"
                            cy="17"
                            r="2"
                            data-oid="6.yu_9w"
                          ></circle>
                          <path d="M9 17h6" data-oid="9ulq7ha"></path>
                          <circle
                            cx="17"
                            cy="17"
                            r="2"
                            data-oid="6l4feid"
                          ></circle>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold" data-oid="jb7ipr1">
                        Dashboard Preview
                      </h3>
                      <p
                        className="text-sm text-muted-foreground"
                        data-oid="exlvwz_"
                      >
                        Sign in to access the full dashboard with comprehensive
                        inventory management tools.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-muted/50" data-oid="a2xm6v-">
          <div className="container px-4 md:px-6" data-oid=".9jt.:m">
            <div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              data-oid="c2kp0aj"
            >
              <div className="space-y-2" data-oid="u8n3n.q">
                <div
                  className="inline-block rounded-lg bg-muted px-3 py-1 text-sm"
                  data-oid="idlp7q6"
                >
                  Key Features
                </div>
                <h2
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                  data-oid="mk:-gc6"
                >
                  Built for Automotive Excellence
                </h2>
                <p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed"
                  data-oid="v6:osir"
                >
                  Designed specifically for automotive companies to manage their
                  vehicle inventory with precision and ease.
                </p>
              </div>
            </div>
            <div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3"
              data-oid="b_bhe3:"
            >
              {[
                {
                  title: "Real-time Stock Updates",
                  description:
                    "Make inventory changes and see them reflected instantly across all user sessions.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-10 w-10"
                      data-oid="a1n2h14"
                    >
                      <path d="M12 2v10" data-oid="bmoge63"></path>
                      <path d="m9 7 3-3 3 3" data-oid="3-swyw5"></path>
                      <path
                        d="M3 12H2a10 10 0 0 0 14.3 9"
                        data-oid="5p5a_ns"
                      ></path>
                      <path
                        d="M21 12a9 9 0 0 0-9.6-8.7"
                        data-oid="j5pwl9q"
                      ></path>
                      <path d="m16 16 2 2 4-4" data-oid="q0o-:rd"></path>
                    </svg>
                  ),
                },
                {
                  title: "Role-Based Access",
                  description:
                    "Secure access controls tailored for Admins and Sales Staff with appropriate permissions.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-10 w-10"
                      data-oid="f4i:ui5"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        data-oid="ytlsy.q"
                      ></path>
                      <circle cx="9" cy="7" r="4" data-oid="jpf71.x"></circle>
                      <path
                        d="M22 21v-2a4 4 0 0 0-3-3.87"
                        data-oid="bs5hm3:"
                      ></path>
                      <path
                        d="M16 3.13a4 4 0 0 1 0 7.75"
                        data-oid="i0x.emw"
                      ></path>
                    </svg>
                  ),
                },
                {
                  title: "Smart Filtering",
                  description:
                    "Powerful search and filtering options to quickly find the exact vehicles you need.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-10 w-10"
                      data-oid="duithdc"
                    >
                      <path d="M3 6h18" data-oid="xpiq4eg"></path>
                      <path d="M7 12h10" data-oid="0ic5kzt"></path>
                      <path d="M10 18h4" data-oid="ooim-hd"></path>
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
                  data-oid="bc-5g5m"
                >
                  <div
                    className="flex flex-col gap-4 text-center items-center"
                    data-oid="9huzzz1"
                  >
                    <div className="text-primary" data-oid="-z31rcj">
                      {feature.icon}
                    </div>
                    <div className="space-y-2" data-oid="2:4jd-d">
                      <h3 className="text-xl font-bold" data-oid="qxm:8v7">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground" data-oid="g_tbzsm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-0" data-oid="vdf.w.t">
        <div
          className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row"
          data-oid="gjog3z2"
        >
          <p className="text-sm text-muted-foreground" data-oid="8zfoa8w">
            © 2023 Motors Stock Manager. All rights reserved.
          </p>
          <div className="flex items-center gap-4" data-oid="tstjwg5">
            <Button variant="ghost" size="icon" asChild data-oid="ipnlgg6">
              <a href="#" className="h-9 w-9" data-oid="mcmy5u4">
                <svg viewBox="0 0 24 24" className="h-4 w-4" data-oid="zhb28qb">
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.992 10.45c.215 4.73-3.313 10-9.49 10a9.457 9.457 0 0 1-5.12-1.5 6.696 6.696 0 0 0 4.92-1.375 3.338 3.338 0 0 1-3.108-2.312c.52.1 1.05.08 1.532-.062a3.335 3.335 0 0 1-2.674-3.262v-.042a3.3 3.3 0 0 0 1.513.416A3.337 3.337 0 0 1 4.512 7.44a9.465 9.465 0 0 0 6.862 3.487 3.335 3.335 0 0 1 5.68-3.042 6.679 6.679 0 0 0 2.119-.81 3.348 3.348 0 0 1-1.465 1.844 6.712 6.712 0 0 0 1.92-.525 6.77 6.77 0 0 1-1.638 1.697l.002.34z"
                    fill="currentColor"
                    data-oid="do7:h8."
                  />
                </svg>
                <span className="sr-only" data-oid="733_9pu">
                  Twitter
                </span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild data-oid="_0mw6.o">
              <a href="#" className="h-9 w-9" data-oid="tlj63sg">
                <svg viewBox="0 0 24 24" className="h-4 w-4" data-oid="h:7kr1e">
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16h4v4h-4v-4zm6-10H8a2 2 0 0 0-2 2v6h2v-6h8v6h2v-6a2 2 0 0 0-2-2z"
                    fill="currentColor"
                    data-oid="jw7ec-_"
                  />
                </svg>
                <span className="sr-only" data-oid="r2tsfmq">
                  Help
                </span>
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
