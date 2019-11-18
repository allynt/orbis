import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isMenuVisible } from './side-menu.selector';

import SideMenu from './side-menu.component';

const mapStateToProps = state => {
  return {
    isMenuVisible: isMenuVisible(state)
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
