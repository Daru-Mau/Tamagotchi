// Type declarations for missing modules

declare module "lottie-react-native" {
  import { ViewProps } from "react-native";
  
  interface AnimatedLottieViewProps extends ViewProps {
    source: any;
    progress?: number;
    speed?: number;
    loop?: boolean;
    autoPlay?: boolean;
    duration?: number;
    resizeMode?: "cover" | "contain" | "center";
    colorFilters?: Array<{
      keypath: string;
      color: string;
    }>;
  }
  
  export default class AnimatedLottieView extends React.Component<AnimatedLottieViewProps> {
    play(startFrame?: number, endFrame?: number): void;
    reset(): void;
    pause(): void;
    resume(): void;
  }
}

// Add other missing type declarations here as needed
