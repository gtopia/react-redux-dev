 /* 
 * Author: zhiyou
 * Date: 2017/10/24
 * Description: 消息页action creators。
 */
import msgTypes from '../constants/message.js';
import apis from '../constants/apis.js';

// 处理调查结果显示
var doResultSurvey = {
    /*
     * @param  {object} data 每道题及选中的答案
     * @param  {array} oldSurveyInfor 初始渲染调查结果的数组
     *  var arr = {
            2:[6,7],
            13:[5],
            18:[20],
            23:[24]
        };
     */
    init: function(data, oldSurveyInfor){
        oldSurveyInfor.map((item) => {
            var answerAdd = data[item.qid];

            item.totalcount = item.totalcount + answerAdd.length;
            item.isShowSurveyResult = true;
            item.answer.map((answerItem) => {
                answerAdd.map((a) => {
                    if (answerItem.aid == a) {
                        answerItem.count += 1;
                        answerItem.select = 1;
                    }
                });
            });
        });
        return oldSurveyInfor;
    },
    initOther: function(aid, oldVoteInfor){
        oldVoteInfor.totalcount += 1;
        oldVoteInfor.isShowVoteResult = true;
        oldVoteInfor.answer.map((item) => {
            if (item.aid == aid) {
                item.count += 1;
                item.select = 1;
            }            
        });
        return oldVoteInfor;
    }
};

//获取投票卡片
export function saveCards(dataList) {
    return {
        type: msgTypes.SAVE_CARDS,
        dataList
    };
}

//清除数据
export function clearData(){
    return {
        type: msgTypes.CLEARDATA
    };
}

//投票
export function vote(newVoteInfor, cid) {
    return {
        type: msgTypes.VOTE,
        newVoteInfor,
        cid
    };
}

//调查
export function survey(newSurveyInfor, hideResultState1, cid) {
    return {
        type: msgTypes.SURVEY,
        newSurveyInfor,
        hideResultState1,
        cid
    };
}

//文章正文
export function showBodyArticle(bodyState, articleIndex, topicId, topicTitle, topicAttend) {
    return {
        type: msgTypes.SHOW_BODY_ARTICLE,
        bodyState,
        articleIndex,
        topicId,
        topicTitle,
        topicAttend
    };
}

//接口提示
export function tips(tipsText, tipsStatus) {
    return {
        type: msgTypes.TIPS,
        tipsText,
        tipsStatus
    };
}

// 显示全文 or 关闭全文
export function checkAllArticle(e){
    return (dispatch) => {
        let bodyState = false, articleIndex, url, topicId, topicTitle, topicAttend;

        if ($(e.target).attr('class') == 'card__showall') {
            bodyState = true;
            articleIndex = $(e.target).attr('data-index');
            url = $(e.target).attr('data-url');
            topicId = $(e.target).attr('data-topicid');
            topicTitle = $(e.target).attr('data-topictitle');
            topicAttend = $(e.target).attr('data-topicattend');

            // SUDA PV 统计 
            window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, url + "#!");
        }
        else if ($(e.target).attr('class') == 'a-closed') {
            bodyState = false;
        }

        dispatch(showBodyArticle(bodyState, articleIndex, topicId, topicTitle, topicAttend));
    };
}

//点赞
export function praise(cid, praiseNum, isPraise) {
    return {
        type: msgTypes.PRAISE,
        cid,
        praiseNum, 
        isPraise
    };
}

export function praiseFunc(e){
    return (dispatch) => {
        let $ele = $(e.currentTarget),
            cid = $ele.attr('data-articleid'),
            type = $ele.attr('data-cardtype'),
            praiseNum = $ele.attr('data-praisenum'),
            isPraise = $ele.attr('data-praise'),
            uid = $ele.attr('data-uid');

        if (isPraise == 0) {
            praiseNum++;

            $.ajax({
                url: apis.CARD_PRAISE, 
                data: {
                    uid: uid,
                    cid: cid,
                    type: type,
                    praise: 1
                },
                type: "POST"
            });

            dispatch(praise(cid, praiseNum, 1));
        }
    }; 
}

//PK function
export function voteFunc(cid, aid, uid, oldVoteInfor){
    return (dispatch) => {
        let data = aid;

        $.ajax({
            url: apis.CARD_VOTE,
            data: {
               vote: data,
               uid: uid,
               cid: cid
            },
            type: "POST",
            success: function (req) {
                let msg, state = false;

                if (req.result.status.code == 0) { //成功
                    let newVoteInfor = doResultSurvey.initOther(aid, oldVoteInfor);
                    dispatch(vote(newVoteInfor, cid));
                    msg = req.result.status.msg;
                    state = false;
                }
                else {
                    msg = req.result.status.msg;
                    state = true;
                }

                dispatch(tips(msg, state ));

                setTimeout(function() {
                    dispatch(tips(msg, false));
                }, 3000);
            },
            error: function (err) {
                if (err) {
                    dispatch(tips('提交失败', true));

                    setTimeout(function() {
                        dispatch(tips('提交失败', false));
                    }, 3000);
                }
            }
        });
        
    };
}

 /*
 * Description: 调查 submit function
 * @param  {string} data 问题id及选中答案
 * @param  {object} changeDataItems 问题id及选中答案
 * @param  {array} oldSurveyInfor 初始渲染调查结果的数组
 */
export function suverySubmitFunc(data, changeDataItems, oldSurveyInfor, uid, cid) {
    return (dispatch) => {
        $.ajax({
            url: apis.CARD_VOTE, 
            data: {
               vote: data,
               uid: uid,
               cid: cid
            },
            type: "POST",
            success: function (req) {
                let msg, state = false;

                if (req.result.status.code == 0) { //成功
                    let newSurveyInfor = doResultSurvey.init(changeDataItems, oldSurveyInfor);
                    dispatch(survey(newSurveyInfor, true, cid));
                    msg = req.result.status.msg;
                    state = false;
                }
                else { //异常
                    msg = req.result.status.msg;
                    state = true;
                }
                
                dispatch(tips(msg, state ));

                setTimeout(function() {
                    dispatch(tips(msg, false));
                }, 3000);
            },
            error: function (err) {
                if (err) {
                    dispatch(tips('提交失败', true));

                    setTimeout(function() {
                        dispatch(tips('提交失败', false));
                    }, 3000);
                }
            }
        });
        
    };
}

//重置为null，用于控制弹层初始动效
export function resetBodyArticleState() {
    return {
        type: msgTypes.RESET_BODY_ARTICLE_STATE
    };
}

export function setQnaData(data) {
    return {
        type: msgTypes.SET_QNA_DATA,
        data: data
    };
}

export function showBodyQna() {
    return {
        type: msgTypes.SHOW_BODY_QNA
    };
}

export function closeBodyQna() {
    return {
        type: msgTypes.CLOSE_BODY_QNA
    };
}

export function resetBodyQnaState() {
    return {
        type: msgTypes.RESET_BODY_QNA_STATE
    };
}
