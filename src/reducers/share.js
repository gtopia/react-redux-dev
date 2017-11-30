import topicTypes from '../constants/topic';
import { Map} from 'immutable';

const initialState = Map({
    shareState: null,
    shareData:Map({
		title:'1',
		url:'2',
		contents:'3',
		img:'4'
	}),
	shareWeiboUrl: '5',
	shareWechatstate: 'none',
	warpState: false,
	safariState: false,
	wxState: false
});

export default function shareReducer(state = initialState, action) {
    switch (action.type) {
        case topicTypes.SHOWSHARE:
        //显示分享 url, title, contents, img
            return state
            	.update('shareState',() => true)
            	.update('shareData',() => action.shareData);
        case topicTypes.HIDESHARE:
        //隐藏分享
            return state.update('shareState',() => false);
        case topicTypes.RESET_SHARE:
            return state.update('shareState',() => null);
        case topicTypes.WEIBOSHARE:
        //微博分享
            return state.update('shareWeiboUrl',() => action.url);
        case topicTypes.WECHATSHARE:
        //微信(朋友圈)分享
        	return state
                .update('shareState',() => false)
                .update('warpState',() => action.state.warpState)
                .update('safariState',() => action.state.safariState)
                .update('wxState',() => action.state.wxState);
        case topicTypes.HIDEWXSHARE:
        //隐藏微信分享
            return state.update('warpState',() => false);
        default:
            return state;
    }
};
