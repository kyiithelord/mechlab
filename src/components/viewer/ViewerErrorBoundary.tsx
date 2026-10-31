import { Component, type ReactNode } from 'react'
type Props={children:ReactNode;assetPath:string}
type State={failed:boolean}
export class ViewerErrorBoundary extends Component<Props,State>{state:State={failed:false};static getDerivedStateFromError():State{return {failed:true}}componentDidUpdate(prev:Props){if(prev.assetPath!==this.props.assetPath&&this.state.failed)this.setState({failed:false})}render(){if(this.state.failed)return <div className="viewer-error" role="alert"><strong>3D model unavailable</strong><span>Check the model asset and reload the page.</span><button onClick={()=>this.setState({failed:false})}>TRY AGAIN</button></div>;return this.props.children}}
