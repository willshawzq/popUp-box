class AlertBox extends React.Component {
  constructor(props) {
    super(props);
  }
  leaveAnimation() {
    let clazz = this.refs.container.classList;
    clazz.remove("confirm-box-flyIn");
    clazz.add("confirm-box-flyOut");

    let node = ReactDOM.findDOMNode(this),
        parentNode = node.parentNode;
    node.addEventListener("animationend", ()=>{
      ReactDOM.unmountComponentAtNode(parentNode);
    });
  }
  handleCancel() {
    this.props.cancelFn();
    this.leaveAnimation();
  }
  handleConfirm() {
    this.props.confirmFn();
    this.leaveAnimation();
  }
  render() {
    return (
      <div ref="container" className="confirm-box-flyIn">
        <div className="confirm-box">
          <div className="confirm-title">
            {this.props.title}
          </div>
          <div className="confirm-content"
            dangerouslySetInnerHTML={{__html: this.props.detail}}
          >
          </div>
          <div className="confirm-option">
            <button type="button" onClick={this.handleCancel.bind(this)}>{this.props.cancel}</button>
            <button type="button" onClick={this.handleConfirm.bind(this)}>{this.props.confirm}</button>
          </div>
        </div>
        <div className="background"></div>
      </div>
    )
  }
}
AlertBox.defaultProps = {
  title: "确认框",
  confirm: "确定",
  cancel: "取消",
  cancelFn: ()=>{},
  confirmFn: ()=>{}
}
AlertBox.propTypes = {
  title: React.PropTypes.string,
  confirm: React.PropTypes.string,
  cancel: React.PropTypes.string,
  detail: React.PropTypes.string.isRequired,
  cancelFn: React.PropTypes.func,
  confirmFn: React.PropTypes.func,
}
ReactDOM.render(
  <AlertBox
    title={"删除弹框"}
    detail={"someting to show"}
    cancelFn={()=>{console.info('cancelFn');}}
    confirmFn={()=>{console.info('confirmFn');}}
  />,
  document.querySelector("#example")
)
