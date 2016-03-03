const dialogSizes = {
  large: [ 800, 600 ],
  normal: [ 600, 400 ],
  mini: [ 500, 300 ]
};

const dialogStyle = {
  confirmBox: {
    in: 'alert-box-flyIn',
    out: 'alert-box-flyOut'
  },
  detailBox: {
    in: 'alert-box-lineIn',
    out: 'alert-box-lineOut'
  }
};

const outLineGap = 4;

const AlertDialog = React.createClass({
  displayName: "AlertDialog",
  propTypes: {
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    size: React.PropTypes.string,
    confirm: React.PropTypes.string,
    cancel: React.PropTypes.string,
    detail: React.PropTypes.string.isRequired,
    cancelFn: React.PropTypes.func,
    confirmFn: React.PropTypes.func,
  },
  getInitialState() {
    let size = dialogSizes[this.props.size];
    //store the position and flag value during dragging
    this.tempState = {
      x: -size[0] / 2,
      y: -size[1] / 2,
      dragDrop: false
    };
    return {
      status: 'in',
      left: -size[0] / 2,
      top: -size[1] / 2
    };
  },
  getDefaultProps() {
    return {
      type: "confirmBox",
      title: "确认框",
      size: "mini",
      confirm: "确定",
      cancel: "取消",
      cancelFn: ()=>{},
      confirmFn: ()=>{}
    }
  },
  leaveAnimation() {
    let node = ReactDOM.findDOMNode(this),
        parentNode = node.parentNode;

    this.setState({
      status: 'out'
    });
    if(Modernizr.cssanimations) {
      addAnimationListener(node, "end", ()=>{
        ReactDOM.unmountComponentAtNode(parentNode);
      });
    }else {
        ReactDOM.unmountComponentAtNode(parentNode);
    }
  },
  handleCancel() {
    this.props.cancelFn();
    this.leaveAnimation();
  },
  handleConfirm() {
    this.props.confirmFn();
    this.leaveAnimation();
  },
  handleMouseDown(ev) {
    this.tempState = {
      x: ev.pageX,
      y: ev.pageY,
      dragDrop: true
    }
  },
  handleMouseMove(ev) {
    let { x, y, dragDrop } = this.tempState,
        { left, top } = this.state;
    if( !dragDrop ) return;

    let rect = this.refs.box.getBoundingClientRect(),
        diffX = ev.pageX - x,
        diffY = ev.pageY - y,
        dropLeft = rect.left + diffX,
        dropTop = rect.top + diffY,
        viewSize = viewPortSize();

        this.tempState.x = ev.pageX;
        this.tempState.y = ev.pageY;

    if( dropLeft + rect.width >= viewSize.width || dropLeft <= 0 ) return;
    if( dropTop + rect.height >= viewSize.height || dropTop <= 0 ) return;

    this.updateDialogPostion(left+diffX, top+diffY);
  },
  updateDialogPostion(left, top) {
    this.setState({
      left,
      top
    });
  },
  handleMouseUp(ev) {
    this.tempState.dragDrop = false;
  },
  render() {
    let {type, size} = this.props,
        {status, left, top} = this.state,
        clazz = dialogStyle[type][status],
        viewSize = viewPortSize();

    size = dialogSizes[size];

    let transform = Modernizr.prefixed('transform');

    let boxStyle = {
          width: `${size[0]}px`,
          height: `${size[1]}px`,
          [transform]: `translate3d(${left}px, ${top}px, 0)`
        },
        outlineStyle = {
          width: `${size[0] + outLineGap}px`,
          height: `${size[1] + outLineGap}px`,
        };

    if(!Modernizr.csstransforms) {
      boxStyle['left'] = (viewSize.width - size[0]) / 2;
      boxStyle['top'] = (viewSize.height - size[1]) / 2;
    }

    return (
      <div ref="container" className={clazz}>
        {(()=>{
          if(type === "detailBox") {
            return <div ref="outline" className="alert-svg-outline" style={outlineStyle}>
                <svg
                    xmlns = "http://www.w3.org/2000/svg"
                    width = "100%"
                    height = "100%"
                    viewBox = "0 0 500 308"
                    preserveAspectRatio = "none">
                    <rect ref="rect"
                        x = "2"
                        y = "2"
                        width = "496"
                        height = "304" />
                </svg></div>;
          }
        })()}
        <div ref="box" className="alert-box" style={boxStyle}>
          <div className="alert-title"
              onMouseDown={this.handleMouseDown}
              onMouseMove={this.handleMouseMove}
              onMouseUp={this.handleMouseUp}>
            {this.props.title}
          </div>
          <div className="alert-content"
              dangerouslySetInnerHTML={{__html: this.props.detail}}
          ></div>
          <div className="alert-option">
            <button type="button" onClick={this.handleCancel}>{this.props.cancel}</button>
            <button type="button" onClick={this.handleConfirm}>{this.props.confirm}</button>
          </div>
        </div>
        <div className="alert-background"></div>
      </div>
    );
  },
  componentDidComponent() {
  },
});
