/**
 * Author: zhiyou
 * Date: 2017/10/26
 * Description: 消息页reducer。
 */
import msgTypes from '../constants/message';
import { List, Map, fromJS } from 'immutable';

const initialState = Map({
    'cardsList': List([]),
    'tipsText': '',
    'tipsStatus': false,
    'hideResultState1': false,
    'articleData': Map({
        'bodyState': null,
        'index': '',
        'topicId': '',
        'topicTitle': '',
        'topicAttend': '',
    }),
    'qnaData': Map({}),
    'bodyQnaState': null
});

export default function messageReducer(state = initialState, action) {
    switch (action.type) {
        case msgTypes.SAVE_CARDS:
            return state.update('cardsList',() => {
                // 将新数据转为immutable对象，后面才能判断出其是否发生变化
                return state.get('cardsList').concat(fromJS(action.dataList));
            });
        case msgTypes.PRAISE:
            return state.updateIn(['cardsList'], (list) => {
                return list.map((item) => {
                    if (item.get('cid') == action.cid) {
                        item = item.set('count', action.praiseNum).set('praise', action.isPraise);
                    }

                    return item;
                });
            });
        case msgTypes.VOTE:
            return state.updateIn(['cardsList'], (list) => {
                return list.map((item) => {
                    if (item.get('cid') == action.cid) {
                        item = item.setIn(['content', 0], fromJS(action.newVoteInfor));
                    }

                    return item;
                });
            });
            // return state.update('voteInfor', () => fromJS(action.newVoteInfor));
        case msgTypes.SURVEY:
            state = state.updateIn(['cardsList'], (list) => {
                return list.map((item) => {
                    if (item.get('cid') == action.cid) {
                        item = item.set('content', fromJS(action.newSurveyInfor));
                    }

                    return item;
                });
            });
            return state.set('hideResultState1', action.hideResultState1);
            // return state.update('suveryInfor',() => fromJS(action.newSurveyInfor))
            //             .set('hideResultState1', action.hideResultState1);
        case msgTypes.SHOW_BODY_ARTICLE:
            return state.set('articleData', fromJS({
                'bodyState': action.bodyState,
                'index': action.articleIndex,
                'topicId': action.topicId,
                'topicTitle': action.topicTitle,
                'topicAttend': action.topicAttend,
            }));
        case msgTypes.TIPS:
            return state.set('tipsText',action.tipsText).set('tipsStatus', action.tipsStatus);
        case msgTypes.CLEARDATA:
            return state.set('cardsList', List([]));
        case msgTypes.RESET_BODY_ARTICLE_STATE:
            return state.setIn(['articleData', 'bodyState'], null);
        case msgTypes.SET_QNA_DATA:
            return state.set('qnaData', fromJS(action.data));
        case msgTypes.SHOW_BODY_QNA:
            return state.set('bodyQnaState', true);
        case msgTypes.CLOSE_BODY_QNA:
            return state.set('bodyQnaState', false);
        case msgTypes.RESET_BODY_QNA_STATE:
            return state.set('bodyQnaState', null);
        default:
            return state;
    }
};
