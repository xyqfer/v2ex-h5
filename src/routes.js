import Home from './pages/Home.vue';
import Discovery from './pages/Discovery.vue';
import Me from './pages/Me.vue';
import Messages from './pages/Messages.vue';
import Nodes from './pages/Nodes.vue';
import Node from './pages/Go.vue';
import Tab from './pages/Tab.vue';
import AllNode from './pages/AllNodes.vue';
import Member from './pages/Member.vue';
import MemberTopic from './pages/MemberTopic.vue';
import MemberReply from './pages/MemberReply.vue';
import ChatDetail from './pages/ChatDetail.vue';
import Dialog from './pages/Dialog.vue';

import NotFound from './pages/404.vue';

// Pages
export default [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/nodes/',
    component: Nodes,
  },
  {
    path: '/all-nodes/',
    component: AllNode,
  },
  {
    path: '/discovery/',
    component: Discovery,
  },
  {
    path: '/me/',
    component: Me,
  },
  {
    path: '/t/:id',
    component: Messages,
  },
  {
    path: '/chatDetail/:id',
    component: ChatDetail,
  },
  {
    path: '/dialog/:chatData',
    component: Dialog,
  },
  {
    path: '/go/:name',
    component: Node,
  },
  {
    path: '/tab/:name',
    component: Tab,
  },
  {
    path: '/member/:name',
    component: Member,
  },
  {
    path: '/member/:name/topics',
    component: MemberTopic,
  },
  {
    path: '/member/:name/replies',
    component: MemberReply,
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    component: NotFound,
  },
];
