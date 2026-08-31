/* Signal Architecture shell: one public narrative route, dark by default, with clear escape routes through anchored navigation. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import GlowCursor from "./components/GlowCursor";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";
import Workbench from "./pages/Workbench";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/case-study" component={CaseStudy} />
      <Route path="/workspace" component={Workbench} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <GlowCursor global color="#67E8F9" secondaryColor="#A78BFA" trailLength={34} trailWidth={7} trailTaper={0.86} followSpeed={0.18} glowIntensity={1.7} glowSpread={1.1} hotspot={0.64} brightness={1.2} opacity={0.82} pulseSpeed={1.1} noiseStrength={0.03} idleFade idleTimeout={900} fadeDuration={760} blendMode="screen">
            <Router />
          </GlowCursor>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
