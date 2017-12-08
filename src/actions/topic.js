 /* 
 * Author: jinping3
 * Date: 2017/05/12
 * Description: attention actions and get topic
 * Modify: zhiyou@2017/07/12 未登录的情况下点击关注时，改为弹窗登录。
           zhiyou@2017/07/17 添加resetBodyArticleState，用于在刚开始进入页面时隐藏文章弹层动效。
           zhiyou@2017/12/06 修复点赞时获取event target错误。
 */
import topicTypes from '../constants/topic.js';
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

//获取话题详情
export function getTopicInfor(infor) {
    return {
        type: topicTypes.GETTOPICINFOR,
        infor
    };
}

export function clearTopicInfor() {
    return {
        type: topicTypes.CLEARTOPICINFOR,
    };
}

//获取投票卡片
export function getCard(dataFirstview) {
    return {
        type: topicTypes.GETCARD,
        dataFirstview
    };
}

//清除数据
export function clearData(){
    return {
        type: topicTypes.CLEARDATA
    };
}

//关注
export function attention(text, uid, tid, isAttention) {
    return {
        type: topicTypes.ATTENTION,
        text,
        uid,
        tid,
        isAttention
    };
}

//投票
export function vote(newVoteInfor, cid) {
    return {
        type: topicTypes.VOTE,
        newVoteInfor,
        cid
    };
}

//调查
export function survey(newSurveyInfor, hideResultState1, cid) {
    return {
        type: topicTypes.SURVEY,
        newSurveyInfor,
        hideResultState1,
        cid
    };
}

//文章正文
export function bodyArticle(state, index) {
    return {
        type: topicTypes.SHOWBODYARTICLE,
        state,
        index
    };
}

//接口提示
export function tips(tipsText, tipsStatus) {
    return {
        type: topicTypes.TIPS,
        tipsText,
        tipsStatus
    };
}

// 显示全文 or 关闭全文
export function checkAllArticle(e){
    return (dispatch) => {
        let state = false, index, url;

        if ($(e.target).attr('class') == 'card__showall') {
            state = true;
            index = $(e.target).attr('data-index');
            url = $(e.target).attr('data-url');

            // SUDA PV 统计 
            window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, url + "#!");
        }
        else if ($(e.target).attr('class') == 'a-closed') {
            state = false;
        }

        dispatch(bodyArticle(state, index));
    };
}

//点击关注
export function attentionFunc(e){

    return (dispatch) => {
        let islogin =  $(e.target).attr('data-islogin'),
            txt = $(e.target).text(),
            uid = $(e.target).attr('data-uid'),
            tid = $(e.target).attr('data-tid'),
            text, isAttention;
        function _attentionFunc(obj){

            $.ajax({
                url: apis.TOPIC_ATTENTION, 
                data: {
                   uid: obj.uid,
                   tid: obj.tid,
                   attention: obj.attention
                },
                type: "POST",
                success: function (req) {
                    let msg, state = false;
                    if (req.result.status.code == 0) { //成功
                        msg = req.result.status.msg;
                        state = false;
                        dispatch(attention(text,isAttention));
                    } else { //异常
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
                        dispatch(tips('请求失败', true));

                        setTimeout(function() {
                            dispatch(tips('请求失败', false));
                        }, 3000);
                    }
                   
                }
            });

        }

        function _handleLogin() {
            var oLogin = (typeof(window.WapLogin) == 'function') ? (new window.WapLogin()) : this;

            oLogin.login(false, function() { 
                window.location.reload();
                // window.getUserInfo(function(res) {
                //     dispatch({
                //         type: actionTypes.LOGIN_SUCCESS,
                //         userInfo: res || {}
                //     });
                // });
            });

            $('#ST_outLogin_mask').on('touchstart touchmove touchend', function(evt) {
                evt.preventDefault();
            });
        }

        if (parseInt(islogin)) {
            if (txt == '+关注') {
                text = '已关注';
                isAttention = 1;
            } else {
                text = '+关注';
                isAttention = 0;
            }
            _attentionFunc({
                uid: uid,
                tid: tid,
                attention: isAttention
            });            
        } else {
            // window.location.href = '//passport.sina.cn/signin/signin?entry=wapsso&vt=4&backTitle=全民话题&r=' + encodeURIComponent(window.location.href) + '&revalid=2';
            _handleLogin();
        }
    };
}

//点赞
export function praise(cid, praiseNum, isPraise) {
    return {
        type: topicTypes.PRAISE,
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
                } else { //异常
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
                } else { //异常
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

export function showViewpoint() {
    return {
        type: topicTypes.SHOW_VIEWPOINT,
    };
}

export function showCmnts() {
    return {
        type: topicTypes.SHOW_CMNTS,
    };
}

export function setTotalCmnts(total) {
    return {
        type: topicTypes.SET_TOTAL_CMNTS,
        total
    };
}

export function resetTotalCmnts() {
    return {
        type: topicTypes.RESET_TOTAL_CMNTS
    };
}


// 重置为null，用于控制弹层初始动效
export function resetBodyArticleState() {
    return {
        type: topicTypes.RESET_BODY_ARTICLE_STATE
    };
}

export function setQnaData(data) {
    return {
        type: topicTypes.SET_QNA_DATA,
        data: data
    };
}

export function showBodyQna() {
    return {
        type: topicTypes.SHOW_BODY_QNA
    };
}

export function closeBodyQna() {
    return {
        type: topicTypes.CLOSE_BODY_QNA
    };
}

export function resetBodyQnaState() {
    return {
        type: topicTypes.RESET_BODY_QNA_STATE
    };
}
