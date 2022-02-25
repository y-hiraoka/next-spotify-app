import { Component, ReactNode } from "react";
import { NotFound } from "./NotFound";

type Props = {};
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true };
  }

  render(): ReactNode {
    return this.state.hasError ? <NotFound /> : this.props.children;
  }
}
