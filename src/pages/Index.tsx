import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" data-oid="8es7rnb">
      <header
        className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        data-oid="-r95m-z"
      >
        <div
          className="container flex h-16 items-center justify-between"
          data-oid="93imzt6"
        >
          <div
            className="font-semibold text-lg tracking-tight"
            data-oid="w73f04y"
          >
            Motors Stock Manager
          </div>
          <div className="flex items-center gap-2" data-oid="fp8kj_y">
            <ThemeToggle data-oid="bof5t.0" />
            <Button onClick={() => navigate("/login")} data-oid="ult98fy">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden" data-oid="5ngj8zz">
        <section className="py-20 sm:py-32" data-oid="h5uxh5h">
          <div className="container px-4 md:px-6" data-oid="58vk-as">
            <div
              className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]"
              data-oid="ndbiozm"
            >
              <div
                className="flex flex-col justify-center space-y-4 animate-slideUp"
                data-oid="ywy.9_n"
              >
                <div className="space-y-2" data-oid="dd4cyfm">
                  <h1
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                    data-oid="xdnij4v"
                  >
                    Streamline Your Vehicle Inventory Management
                  </h1>
                  <p
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                    data-oid="wye5:j6"
                  >
                    Efficiently manage automotive stock with real-time updates.
                    Designed specifically for internal teams to track inventory
                    with precision and ease.
                  </p>
                </div>
                <div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  data-oid="af:ow90"
                >
                  <Button
                    onClick={() => navigate("/login")}
                    size="lg"
                    className="h-12"
                    data-oid="csbh15-"
                  >
                    Get Started
                  </Button>
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    size="lg"
                    className="h-12"
                    data-oid="kwcgjyg"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div
                className="mx-auto flex w-full items-center justify-center"
                data-oid="-qgn_6q"
              >
                <div
                  className="relative aspect-video w-full rounded-xl bg-muted overflow-hidden shadow-xl animate-fadeIn animation-delay-300"
                  data-oid="7lpp053"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/0 to-primary/5"
                    data-oid=".5s2f7i"
                  ></div>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    data-oid="jhkqp_b"
                  >
                    <div
                      className="space-y-4 p-6 text-center"
                      data-oid="hf7-06x"
                    >
                      <div
                        className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
                        data-oid="8k9pe5p"
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
                          data-oid="wo:ipvi"
                        >
                          <path
                            d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"
                            data-oid="7qyir5e"
                          ></path>
                          <circle
                            cx="7"
                            cy="17"
                            r="2"
                            data-oid="zq7:9kb"
                          ></circle>
                          <path d="M9 17h6" data-oid="uymgwtz"></path>
                          <circle
                            cx="17"
                            cy="17"
                            r="2"
                            data-oid="9u04nfj"
                          ></circle>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold" data-oid="d8ptulp">
                        Dashboard Preview
                      </h3>
                      <p
                        className="text-sm text-muted-foreground"
                        data-oid="irzianb"
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

        <section className="py-12 md:py-24 bg-muted/50" data-oid=".-8kmv_">
          <div className="container px-4 md:px-6" data-oid="33-zn3w">
            <div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              data-oid="hg1.40y"
            >
              <div className="space-y-2" data-oid="r_9vi-6">
                <div
                  className="inline-block rounded-lg bg-muted px-3 py-1 text-sm"
                  data-oid="yaz7buf"
                >
                  Key Features
                </div>
                <h2
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                  data-oid="gjfcycb"
                >
                  Built for Automotive Excellence
                </h2>
                <p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed"
                  data-oid="fd7sgjt"
                >
                  Designed specifically for automotive companies to manage their
                  vehicle inventory with precision and ease.
                </p>
              </div>
            </div>
            <div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3"
              data-oid="uz2q:pa"
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
                      data-oid="x0pl9qd"
                    >
                      <path d="M12 2v10" data-oid="em50x5w"></path>
                      <path d="m9 7 3-3 3 3" data-oid="v9n7y1e"></path>
                      <path
                        d="M3 12H2a10 10 0 0 0 14.3 9"
                        data-oid="whhmq7_"
                      ></path>
                      <path
                        d="M21 12a9 9 0 0 0-9.6-8.7"
                        data-oid="gw72vka"
                      ></path>
                      <path d="m16 16 2 2 4-4" data-oid="9fpqvs3"></path>
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
                      data-oid="angymso"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        data-oid="b1ntjj7"
                      ></path>
                      <circle cx="9" cy="7" r="4" data-oid="___0r_h"></circle>
                      <path
                        d="M22 21v-2a4 4 0 0 0-3-3.87"
                        data-oid="hek_:v5"
                      ></path>
                      <path
                        d="M16 3.13a4 4 0 0 1 0 7.75"
                        data-oid="rvffdy."
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
                      data-oid="bjqdovh"
                    >
                      <path d="M3 6h18" data-oid="9i19rsp"></path>
                      <path d="M7 12h10" data-oid="s1nm_-."></path>
                      <path d="M10 18h4" data-oid="fdgannk"></path>
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
                  data-oid="rgo.634"
                >
                  <div
                    className="flex flex-col gap-4 text-center items-center"
                    data-oid="3agb5pk"
                  >
                    <div className="text-primary" data-oid="8htnhor">
                      {feature.icon}
                    </div>
                    <div className="space-y-2" data-oid="p:z8p5a">
                      <h3 className="text-xl font-bold" data-oid="9nyh2ho">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground" data-oid="b55ju-s">
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

      <footer className="w-full border-t py-6 md:py-0" data-oid="g9jm:wv">
        <div
          className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row"
          data-oid="ep9h1a_"
        >
          <p className="text-sm text-muted-foreground" data-oid="ye6bhok">
            © 2023 Motors Stock Manager. All rights reserved.
          </p>
          <div className="flex items-center gap-4" data-oid="dq9yiaz">
            <Button variant="ghost" size="icon" asChild data-oid="c605f-y">
              <a href="#" className="h-9 w-9" data-oid="4azbgn:">
                <svg viewBox="0 0 24 24" className="h-4 w-4" data-oid="8s74pbo">
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.992 10.45c.215 4.73-3.313 10-9.49 10a9.457 9.457 0 0 1-5.12-1.5 6.696 6.696 0 0 0 4.92-1.375 3.338 3.338 0 0 1-3.108-2.312c.52.1 1.05.08 1.532-.062a3.335 3.335 0 0 1-2.674-3.262v-.042a3.3 3.3 0 0 0 1.513.416A3.337 3.337 0 0 1 4.512 7.44a9.465 9.465 0 0 0 6.862 3.487 3.335 3.335 0 0 1 5.68-3.042 6.679 6.679 0 0 0 2.119-.81 3.348 3.348 0 0 1-1.465 1.844 6.712 6.712 0 0 0 1.92-.525 6.77 6.77 0 0 1-1.638 1.697l.002.34z"
                    fill="currentColor"
                    data-oid=":t0vk_f"
                  />
                </svg>
                <span className="sr-only" data-oid="51lz_fo">
                  Twitter
                </span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild data-oid="xsk:pu_">
              <a href="#" className="h-9 w-9" data-oid="qqx2ww_">
                <svg viewBox="0 0 24 24" className="h-4 w-4" data-oid="6_hssmy">
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16h4v4h-4v-4zm6-10H8a2 2 0 0 0-2 2v6h2v-6h8v6h2v-6a2 2 0 0 0-2-2z"
                    fill="currentColor"
                    data-oid="p81_88y"
                  />
                </svg>
                <span className="sr-only" data-oid="b-5.n65">
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
