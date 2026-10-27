import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Mobile address bars resize the viewport while scrolling; refreshing on that makes scroll animations jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
}
export { gsap, ScrollTrigger };
