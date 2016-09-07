webpackJsonp([0],{0:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}var a=r(1),u=n(a),o=r(30),l=n(o),s=r(163),d=r(226),i=r(233),c=r(248),f=n(c),p=r(267),h=n(p),m={user:window.__INITIAL_STATE__.user},v=(0,i.combineReducers)(h["default"]),w=(0,i.createStore)(v,m),_=function(e,t){var r=w.getState(),n=r.user;n.authenticated||t({pathname:"/login"})},g=function(e,t){var r=w.getState(),n=r.user;n.authenticated&&t({pathname:"/"})},E=(0,f["default"])(_,g);l["default"].render(u["default"].createElement(d.Provider,{store:w},u["default"].createElement(s.Router,{routes:E,history:s.browserHistory})),document.querySelector("#app-holder"))},248:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=function(e,t){return{path:"/",component:u["default"],indexRoute:{component:l["default"]},childRoutes:[{path:"login",component:s.Login,onEnter:t},{path:"signup",component:s.Signup,onEnter:t},{path:"profile",component:s.Profile,onEnter:e},{path:"profile/change-password",component:s.ChangePassword,onEnter:e}]}};var a=r(249),u=n(a),o=r(257),l=n(o),s=r(258)},249:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function a(e){return o["default"].createElement("div",{id:"app-base"},o["default"].createElement(s["default"],null),o["default"].createElement("main",null,e.children),o["default"].createElement(i["default"],null))}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a;var u=r(1),o=n(u),l=r(250),s=n(l),d=r(256),i=n(d)},250:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function a(e){var t=e.user,r=e.logoutUser;return l["default"].createElement("header",null,l["default"].createElement(s.IndexLink,{id:"home",to:{pathname:"/"}},"Cryptonite"),l["default"].createElement("nav",null,t.authenticated?l["default"].createElement(f,{user:t,logoutUser:r}):l["default"].createElement(u,null)))}function u(e){return l["default"].createElement("ul",null,l["default"].createElement("li",null,l["default"].createElement(s.Link,{to:{pathname:"signup"}},"Sign Up")),l["default"].createElement("li",null,l["default"].createElement(s.Link,{to:{pathname:"login"}},"Login")))}Object.defineProperty(t,"__esModule",{value:!0});var o=r(1),l=n(o),s=r(163),d=r(226),i=r(251),c=r(254),f=(0,s.withRouter)(function(e){var t=function(t){t.preventDefault(),(0,i.logout)().then(function(){e.logoutUser(),e.router.push("/")})};return l["default"].createElement("ul",null,l["default"].createElement("li",null,l["default"].createElement(s.Link,{className:"cap",to:{pathname:"profile"}},e.user.username)),l["default"].createElement("li",null,l["default"].createElement("a",{href:"#",onClick:t},"Logout")))});t["default"]=(0,d.connect)(function(e){return{user:e.user}},{logoutUser:c.logoutUser})(a)},251:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changePassword=t.logout=t.signup=t.login=void 0,r(252);var n=r(253);t.login=function(e,t){var r=(0,n.getCSRFToken)();return fetch("/api/auth/login",{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":r},body:JSON.stringify({username:e,password:t})})},t.signup=function(e,t,r){return fetch("/api/auth/signup",{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":(0,n.getCSRFToken)()},body:JSON.stringify({username:e,password1:t,password2:r})})},t.logout=function(){return fetch("/api/auth/logout",{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":(0,n.getCSRFToken)()}})},t.changePassword=function(e,t,r){return fetch("/api/auth/change_password",{method:"POST",credentials:"same-origin",headers:{"X-CSRFToken":(0,n.getCSRFToken)()},body:JSON.stringify({old_password:e,new_password1:t,new_password2:r})})}},253:function(e,t){"use strict";function r(){var e=document.cookie.split("&");return e.reduce(function(e,t){if(void 0!==e)return e;var r=t.split("="),a=n(r,2),u=a[0],o=a[1];return"csrftoken"===u?o:e},void 0)}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){var r=[],n=!0,a=!1,u=void 0;try{for(var o,l=e[Symbol.iterator]();!(n=(o=l.next()).done)&&(r.push(o.value),!t||r.length!==t);n=!0);}catch(s){a=!0,u=s}finally{try{!n&&l["return"]&&l["return"]()}finally{if(a)throw u}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();t.getCSRFToken=r},254:function(e,t,r){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t["default"]=e,t}Object.defineProperty(t,"__esModule",{value:!0}),t.logoutUser=t.loginUser=void 0;var a=r(255),u=n(a);t.loginUser=function(e){return{type:u.LOGIN_USER,user:e}},t.logoutUser=function(){return{type:u.LOGOUT_USER}}},255:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.LOGIN_USER="LOGIN_USER",t.LOGOUT_USER="LOGOUT_USER"},256:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function a(e){return o["default"].createElement("footer",null,"made by ",o["default"].createElement("a",{href:"http://www.pshrmn.com"},"pshrmn.com"))}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a;var u=r(1),o=n(u)},257:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function a(e){return o["default"].createElement("div",null,o["default"].createElement("h1",null,"Jrypbzr gb Pelcgbavgr!"),o["default"].createElement("p",null,'Cryptonite provides challenges to help you learn the basics of cryptography. In case  you were wondering, "Jrypbzr gb Pelcgbavgr!" is the phrase "Welcome to Cryptonite!" which has been encoded using a rot-13 shift cypher.'))}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a;var u=r(1),o=n(u)},258:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var a=r(259);Object.defineProperty(t,"Login",{enumerable:!0,get:function(){return n(a)["default"]}});var u=r(262);Object.defineProperty(t,"Signup",{enumerable:!0,get:function(){return n(u)["default"]}});var o=r(264);Object.defineProperty(t,"ChangePassword",{enumerable:!0,get:function(){return n(o)["default"]}});var l=r(266);Object.defineProperty(t,"Profile",{enumerable:!0,get:function(){return n(l)["default"]}})},259:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function a(e){return o["default"].createElement("div",null,o["default"].createElement("h2",null,"Login"),o["default"].createElement(d["default"],null),o["default"].createElement("p",null,"Don't have an account? ",o["default"].createElement(l.Link,{to:{pathname:"/signup"}},"Sign up here")))}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a;var u=r(1),o=n(u),l=r(163),s=r(260),d=n(s)},260:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var a=r(1),u=n(a),o=r(226),l=r(163),s=r(261),d=r(251),i=r(254),c=u["default"].createClass({displayName:"LoginForm",getInitialState:function(){return{username:"",password:"",errors:{}}},handleUsername:function(e){this.setState({username:e.target.value})},handlePassword:function(e){this.setState({password:e.target.value})},handleSubmit:function(e){var t=this;e.preventDefault(),(0,d.login)(this.state.username,this.state.password).then(function(e){return e.json()}).then(function(e){return e.success?(t.props.loginUser(e.user),void t.props.router.push("/")):Promise.reject(e.errors)})["catch"](function(e){t.setState({errors:e})})},render:function(){var e=this.state,t=e.username,r=e.password,n=e.errors,a=void 0===n?{}:n;return u["default"].createElement("form",{onSubmit:this.handleSubmit},u["default"].createElement(s.Errors,{errors:a.__all__}),u["default"].createElement(s.InputRow,{name:"Username",value:t,handler:this.handleUsername,errors:a.username,id:"login-username-input"}),u["default"].createElement(s.InputRow,{name:"Password",value:r,type:"password",handler:this.handlePassword,errors:a.password,id:"login-password-input"}),u["default"].createElement("div",null,u["default"].createElement("button",null,"Login")))}});t["default"]=(0,o.connect)(null,{loginUser:i.loginUser})((0,l.withRouter)(c))},261:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.Errors=t.InputRow=void 0;var a=r(1),u=n(a),o=(t.InputRow=function(e){var t=e.name,r=e.value,n=void 0===r?"":r,a=e.type,l=void 0===a?"text":a,s=e.handler,d=e.id,i=void 0===d?"input-"+Math.floor(1e4*Math.random()):d,c=e.errors;return u["default"].createElement("div",{className:"input-row"},u["default"].createElement("div",null,u["default"].createElement(o,{errors:c})),u["default"].createElement("label",{htmlFor:i},t),u["default"].createElement("input",{type:l,id:i,value:n,onChange:s}))},t.Errors=function(e){var t=e.errors;return t&&t.length?u["default"].createElement("ul",{className:"errors"},t.map(function(e,t){return u["default"].createElement("li",{key:t},e)})):null})},262:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function a(e){return o["default"].createElement("div",null,o["default"].createElement("h2",null,"Sign Up"),o["default"].createElement(d["default"],null),o["default"].createElement("p",null,"Already have an account? ",o["default"].createElement(l.Link,{to:{pathname:"/login"}},"Login here")))}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a;var u=r(1),o=n(u),l=r(163),s=r(263),d=n(s)},263:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var a=r(1),u=n(a),o=r(226),l=r(163),s=r(261),d=r(251),i=r(254),c=u["default"].createClass({displayName:"SignupForm",getInitialState:function(){return{username:"",password1:"",password2:""}},handleUsername:function(e){this.setState({username:e.target.value})},handlePassword1:function(e){this.setState({password1:e.target.value})},handlePassword2:function(e){this.setState({password2:e.target.value})},handleSubmit:function(e){var t=this;e.preventDefault(),(0,d.signup)(this.state.username,this.state.password1,this.state.password2).then(function(e){return e.json()}).then(function(e){return e.success?(t.props.loginUser(e.user),void t.props.router.push("/")):Promise.reject(e.errors)})["catch"](function(e){t.setState({errors:e})})},render:function(){var e=this.state,t=e.username,r=e.password1,n=e.password2,a=e.errors,o=void 0===a?{}:a;return u["default"].createElement("form",{onSubmit:this.handleSubmit},u["default"].createElement(s.Errors,{errors:o.__all__}),u["default"].createElement(s.InputRow,{name:"Username",value:t,handler:this.handleUsername,errors:o.username,id:"signup-username-input"}),u["default"].createElement(s.InputRow,{name:"Password",value:r,type:"password",handler:this.handlePassword1,errors:o.password1,id:"signup-password1-input"}),u["default"].createElement(s.InputRow,{name:"Password (Verify)",value:n,type:"password",handler:this.handlePassword2,errors:o.password2,id:"signup-password2-input"}),u["default"].createElement("div",null,u["default"].createElement("button",null,"Sign Up")))}});t["default"]=(0,o.connect)(null,{loginUser:i.loginUser})((0,l.withRouter)(c))},264:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function a(e){return o["default"].createElement("div",null,o["default"].createElement("h2",null,"Change Password"),o["default"].createElement(s["default"],null))}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a;var u=r(1),o=n(u),l=r(265),s=n(l)},265:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var a=r(1),u=n(a),o=r(261),l=r(251),s=u["default"].createClass({displayName:"ChangePasswordForm",getInitialState:function(){return{old_password:"",new_password1:"",new_password2:"",success:!1}},handleOldPassword:function(e){this.setState({old_password:e.target.value,success:!1})},handlePassword1:function(e){this.setState({new_password1:e.target.value,success:!1})},handlePassword2:function(e){this.setState({new_password2:e.target.value,success:!1})},handleSubmit:function(e){var t=this;e.preventDefault();var r=this.state,n=r.old_password,a=r.new_password1,u=r.new_password2;(0,l.changePassword)(n,a,u).then(function(e){return e.json()}).then(function(e){return e.success?void t.setState({success:!0,errors:{}}):Promise.reject(e.errors)})["catch"](function(e){t.setState({errors:e})})},render:function(){var e=this.state,t=e.old_password,r=e.new_password1,n=e.new_password2,a=e.success,l=e.errors,s=void 0===l?{}:l;return u["default"].createElement("form",{onSubmit:this.handleSubmit},a?u["default"].createElement("p",null,"Password change successful"):null,u["default"].createElement(o.Errors,{errors:s.__all__}),u["default"].createElement(o.InputRow,{name:"Old Password",value:t,type:"password",handler:this.handleOldPassword,errors:s.old_password,id:"password-old_password-input"}),u["default"].createElement(o.InputRow,{name:"Password",value:r,type:"password",handler:this.handlePassword1,errors:s.new_password1,id:"password-password1-input"}),u["default"].createElement(o.InputRow,{name:"Password (Verify)",value:n,type:"password",handler:this.handlePassword2,errors:s.new_password2,id:"password-password2-input"}),u["default"].createElement("div",null,u["default"].createElement("button",null,"Change Password")))}});t["default"]=s},266:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function a(e){e.user;return o["default"].createElement("div",null,o["default"].createElement(s.Link,{to:{pathname:"profile/change-password"}},"Change Password"))}Object.defineProperty(t,"__esModule",{value:!0});var u=r(1),o=n(u),l=r(226),s=r(163);t["default"]=(0,l.connect)(function(e){return{user:e.user}})(a)},267:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var a=r(268),u=n(a);t["default"]={user:u["default"]}},268:function(e,t,r){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t["default"]=e,t}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=function(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],t=arguments[1];switch(t.type){case u.LOGIN_USER:return Object.assign({},t.user,{authenticated:!0});case u.LOGOUT_USER:return{authenticated:!1};default:return e}};var a=r(255),u=n(a)}});