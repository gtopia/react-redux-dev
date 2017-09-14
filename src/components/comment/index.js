/**
 * Author: zhiyou
 * Date: 2017/05/18
 * Description: 评论组件。
 * Modify: jinping3 样式修改 
 *         zhiyou@2017/07/17 修改空评论时的logo与样式。
 *         zhiyou@2017/07/18 适配浏览器resize，添加标志位防止多次触发resize。
 *         zhiyou@2017/09/14 修改加载更多时loading显示逻辑。
 */
import './index.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS, List } from 'immutable';
import reqObj from '../../static/util/request.js';
import classNames from 'classnames';
import cookieUtil from '../../static/util/cookie.js';
import throttle from '../../static/util/throttle.js';

class Comment extends Component {
    constructor(props) {
        super(props);

        this.PAGESIZE = 20;         // 每页显示20条
        this.LIMIT_REPLYSIZE = 2;   // 回复超过2条后折叠
        this.LIMIT_HOTSIZE = 10;    // 热门评论最多显示10条

        this.conf = {
            'getCmntsApi': 'http://comment5.news.sina.com.cn/page/info',
            'agreeApi': 'http://comment5.news.sina.com.cn/cmnt/vote',
            'getRepliesApi': 'http://comment5.news.sina.com.cn/cmnt/info',
            'submitCmntApi': 'http://comment5.news.sina.com.cn/cmnt/submit',
            'defaultFace': 'http://i3.sinaimg.cn/dy/deco/2012/1018/sina_comment_defaultface.png',
            'channel': 'wap',
            'newsid': '',   // 'topic-' + topicId
            // 'newsid': '00f082ab2e451000',    // gj
            // 'newsid': 'comos-fyfuzny3178982',   // ty
            'thread': 1,
            'latestSize': this.PAGESIZE,
            'hotSize': this.LIMIT_HOTSIZE,
            'replySize': this.LIMIT_REPLYSIZE,
        };

        this.state = {
            'loading': false,
            'requesting': false,
            'nextPage': 1,
            'totalCount': 0,
            'hotCmnts': [],
            'latestCmnts': [],
            'isGetAll': false,
            'replyInfo': {
                'type': '',     // 评论类型（latestCmnts/hotCmnts）
                'index': null,  // 评论话题的评论索引
                'rindex': null, // 回复个人的评论索引
                'data': {},     // 评论数据
            },
            'status': 0,        // -1：失败，0: 初始化，1：成功，2：发布中
        };
    }

    componentDidMount() {
        let actionPos = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0
        };
        let inputPos = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0
        };

        // 禁止评论弹层滑动和点击
        $('.cmnts__masklayer').on('touchstart touchmove touchend', function(e) {
            e.preventDefault();
        });

        // 禁止输入框容器滑动
        $('.cmnts__input-ctner').on('touchstart', function(e) {
            actionPos.startX = e.changedTouches[0].pageX;
            actionPos.startY = e.changedTouches[0].pageY;
        });

        $('.cmnts__input-ctner').on('touchmove', function(e) {
            //获取滑动屏幕时的X,Y
            actionPos.endX = e.changedTouches[0].pageX;
            actionPos.endY = e.changedTouches[0].pageY;

            //获取滑动距离
            var distanceX = actionPos.endX - actionPos.startX;
            var distanceY = actionPos.endY - actionPos.startY;

            //禁止垂直滑动
            if (Math.abs(distanceX) < Math.abs(distanceY)) {
                e.preventDefault();
            }
        });

        // 限制输入框滑动方向
        $('.cmnts__input').on('touchstart', function(e) {
            inputPos.startX = e.changedTouches[0].pageX;
            inputPos.startY = e.changedTouches[0].pageY;
        });

        $('.cmnts__input').on('touchmove', function(e) {
            //获取滑动屏幕时的X,Y
            inputPos.endX = e.changedTouches[0].pageX;
            inputPos.endY = e.changedTouches[0].pageY;

            //获取滑动距离
            var distanceX = inputPos.endX - inputPos.startX;
            var distanceY = inputPos.endY - inputPos.startY;

            //判断垂直滑动
            if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY < 0) {
                // 已滑到底部时，禁止向上滑动
                if ($(this)[0].scrollTop + $(this).height() >= $(this)[0].scrollHeight) {
                    e.preventDefault();
                }
            }
            else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 0) {
                // 已滑到顶部时，禁止向下滑动
                if ($(this)[0].scrollTop <= 0) {
                    e.preventDefault();
                }
            }
        });

        // 适配浏览器resize
        // let _this = this;
        // let adjustingCmntsPopup = false;
        // $(window).on('resize', function() {
        //     if (!adjustingCmntsPopup && $('.popup__cmnts').is(':visible')) {
        //         adjustingCmntsPopup = true;
        //         _this._hideCmntsPopup();
        //         _this._showCmntsPopup();
        //         adjustingCmntsPopup = false;
        //     }
        // });
    }

    componentWillReceiveProps(nextProps) {
        let newsid = nextProps.newsId;
        if (newsid && newsid!=this.conf.newsid && this.state.nextPage==1) {
            this.conf.newsid = newsid;

            // 获取第一页数据
            this._getData({
                url: this.conf.getCmntsApi,
                page: 1
            });

            $(window).on('scroll', throttle({
                'fn': this._loadMore,
                'context': this,
                'delay': 300,
                'mustRunDelay': null
            }));
        }
    }

    componentDidUpdate() {
        // 检查样式
        let showmoreList = $('[class^="replies__showmore"]');
        showmoreList.forEach((item) => {
            if ($(item).parent().parent().parent().next().length) {
                $(item).removeClass('replies__showmore').removeClass('replies__showmore--top').addClass('replies__showmore--top');
            }
            else {
                $(item).removeClass('replies__showmore').removeClass('replies__showmore--top').addClass('replies__showmore');
            }
        });

        this.refs['cmnts_textarea'].focus();
    }

    _getData(opt) {
        let _this = this;

        if (_this.state.requesting || !_this.conf.channel || !_this.conf.newsid) {
            return;
        }

        _this.setState({
            'requesting': true,
            'loading': true
        });

        // 获取评论数据
        var rqPara = {
            'channel': _this.conf.channel,
            'newsid': _this.conf.newsid,
            'thread': _this.conf.thread,
            'page_size': _this.conf.latestSize,
            'h_size': _this.conf.hotSize,
            't_size': _this.conf.replySize,
            'ie': 'utf-8',
            'oe': 'utf-8',
            'page': opt.page,
        };
        var reqCb = reqObj.request({
            url: opt.url,
            data: rqPara,
            type: 'GET',
            timeout: 10000
        });

        reqCb.complete = function() {
            setTimeout(function() {
                _this.setState({
                    'requesting': false,
                    'loading': false
                });
            }, 60);
        };

        reqCb.success = function(res) {
            if (res && res.result && res.result.status && !res.result.status.code) {
                // count.total包括隐藏的（被监控删掉的）、支持的和显示的
                let totalCmnts = res.result.count.total;
                if (totalCmnts > 0) {
                    if (parseInt(totalCmnts) >= 100000000) {
                        totalCmnts = parseFloat((parseInt(totalCmnts)/100000000).toFixed(1)) + '亿';
                    }

                    if (parseInt(totalCmnts) >= 10000) {
                        totalCmnts = parseFloat((parseInt(totalCmnts)/10000).toFixed(1)) + '万';   
                    }

                    _this.setState({
                        'totalCount': totalCmnts
                    });
                    _this.props.setTotalCmnts(totalCmnts);
                }

                _this.setState({
                    'latestCmnts': _this.state['latestCmnts'].concat(_this._formatData(res.result.cmntlist, res.result.threaddict))
                });

                if (opt.page === 1) {
                    _this.setState({
                        'hotCmnts': _this._formatData(res.result.hot_list, res.result.threaddict)
                    });
                }

                if (res.result.cmntlist.length < _this.PAGESIZE) {
                    _this.setState({
                        'isGetAll': true
                    });
                }

                _this.setState((prevState) => {
                    return {'nextPage': prevState.nextPage+1};
                });
            }
        };
    }

    _getReplyData(opt) {
        var _this = this;

        if (!opt.mid || !_this.conf.channel || !_this.conf.newsid) {
            return;
        }

        // 获取评论数据
        var rqPara = {
            'channel': _this.conf.channel,
            'newsid': _this.conf.newsid,
            'thread': _this.conf.thread,
            'mid': opt.mid
        };
        var reqCb = reqObj.request({
            url: opt.url,
            data: rqPara,
            type: 'GET',
            timeout: 3000
        });

        reqCb.success = function(res) {
            if (res && res.result && res.result.threaddict) {
                var cmntOwnerInfo = res.result.cmntlist[0];
                var userName = _this._parseUserInfo(cmntOwnerInfo.config, 'wb_screen_name', false);

                var replyDict = res.result.threaddict[opt.mid];
                var replyList = [];

                if (replyDict && replyDict.list) {
                    replyList = _this._formatReplyList(replyDict.list, userName || cmntOwnerInfo.nick);
                }

                var cmntType = _this.refs[opt.mid].dataset['type'];
                var cmntIndex = _this.refs[opt.mid].dataset['index'];
                var imList = List();
                var newImList = List();

                imList = fromJS(_this.state[cmntType]);
                newImList = imList.setIn([cmntIndex, 'isGetAllReplies'], opt.isShowAll)
                                  .setIn([cmntIndex, 'replyList'], fromJS(replyList));

                _this.setState(() => {
                    let newState = {};
                    newState[cmntType] = newImList.toJS();
                    return newState;
                });
            }
        };
    }

    _parseUserInfo(userinfo, key, isImgUrl) {
        var value = '';

        if (userinfo.indexOf(key) >= 0) {
            if (isImgUrl) {
                value = decodeURIComponent(userinfo.split(key + '=')[1].split('&')[0]);
            }
            else {
                value = userinfo.split(key + '=')[1].split('&')[0];
            }
        }

        return value;
    }

    _formatTime(rawStr) {
        var formatStr = '';

        try {
            var timeStr = $.trim(rawStr);   // "2017-03-23 10:18:07"
            var timeList = timeStr.split(' ');
            var date = timeList[0];
            var time = timeList[1];
            var dateList = date.split('-');
            var timeList = time.split(':');

            var year = parseInt(dateList[0]);
            var month = parseInt(dateList[1]);
            var day = parseInt(dateList[2]);
            var hour = parseInt(timeList[0]);
            var mins = parseInt(timeList[1]);
            var formatHour = hour < 10 ? ('0'+hour) : hour;
            var formatMins = mins < 10 ? ('0'+mins) : mins;
            var formatTime = formatHour + ':' + formatMins;

            // 获取当前时间
            var d = new Date();
            var curYear = d.getFullYear();
            var curMonth = d.getMonth() + 1;
            var curDay = d.getDate();
            var curHour = d.getHours();
            var curMins = d.getMinutes();

            if (year != curYear) {
                formatStr = year + '年' + month + '月' + day + '日 ' + formatTime;
            }
            else if (month!=curMonth || day<(curDay-1)) {
                formatStr = month + '月' + day + '日 ' + formatTime;
            }
            else if ((day+1) == curDay){
                formatStr = '昨天 ' + formatTime;
            }
            else if (day==curDay && (hour*60+mins+3)>=(curHour*60+curMins)) {
                formatStr = '刚刚';
            }
            else {
                formatStr = '今天 ' + formatTime;
            }
        }
        catch (err) {
            formatStr = '';
        }

        return formatStr;
    }

    _formatReplyList(replylist, cmntOwner) {
        var _this = this;
        var formatList = [];
        var len = replylist.length;

        for (var i=len-1; i >= 0; i--) {
            var obj = {};
            var iReply = replylist[i];
            var userPic = _this._parseUserInfo(iReply.config, 'wb_profile_img', true);
            var userName = _this._parseUserInfo(iReply.config, 'wb_screen_name', false);
            var reply2Name = _this._parseUserInfo(iReply.config, 'p_nick', false);

            // if (parseInt(iReply.agree) >= 10000) {
            //     iReply.agree = (parseInt(iReply.agree)/10000).toFixed(1) + '万';
            // }

            obj['userPic'] = userPic ? userPic : _this.conf.defaultFace;
            obj['userName'] = userName ? userName : iReply.nick;
            obj['time'] = _this._formatTime(iReply.time);
            obj['agreeNum'] = iReply.agree;
            obj['hadAgreed'] = false;       // 是否已经点过赞
            obj['content'] = iReply.content;
            obj['mid'] = iReply.mid;        // 自己
            obj['pmid'] = iReply.parent;    // 回复的人
            obj['level'] = iReply.level;    // 盖楼层数

            // 设置回复的人的名字
            if (obj['level'] >= 2) {
                // 二级及以上回复需要根据pmid获取回复的对象的昵称，显示“@xxx”
                obj['replyTo'] = reply2Name;
            }
            else {
                obj['replyTo'] = cmntOwner;
            }

            formatList.unshift(obj);
        }

        return formatList;
    }

    _formatData(cmntlist, threaddict) {
        var _this = this;
        var formatList = [];

        if (cmntlist && cmntlist.length) {
            var cmntNum = cmntlist.length;
            for (var i=0; i < cmntNum; i++) {
                var obj = {};
                var iCmnt = cmntlist[i];
                var userPic = _this._parseUserInfo(iCmnt.config, 'wb_profile_img', true);
                var userName = _this._parseUserInfo(iCmnt.config, 'wb_screen_name', false);

                // if (parseInt(iCmnt.agree) >= 10000) {
                //     iCmnt.agree = (parseInt(iCmnt.agree)/10000).toFixed(1) + '万';
                // }

                obj['userPic'] = userPic ? userPic : _this.conf.defaultFace;
                obj['userName'] = userName ? userName : iCmnt.nick;
                obj['time'] = _this._formatTime(iCmnt.time);
                obj['agreeNum'] = iCmnt.agree;
                obj['hadAgreed'] = false;           // 是否已经点过赞
                obj['content'] = iCmnt.content;
                obj['mid'] = iCmnt.mid;
                obj['isGetAllReplies'] = false;     // 是否已显示全部回复

                var replyDict = threaddict[obj['mid']];
                obj['replyTotal'] = 0;
                obj['replyList'] = [];

                if (replyDict && replyDict.list) {
                    obj['replyTotal'] = replyDict.count;
                    obj['replyList'] = _this._formatReplyList(replyDict.list, obj['userName']);
                }

                formatList.push(obj);
            }
        }

        return formatList;
    }

    _handleAgree(e) {
        let _this = this;

        if (!_this.conf.channel || !_this.conf.newsid) {
            return;
        }

        var $target = $(e.currentTarget);
        var $item = $target.parents("[class|='item']");
        var mid = $item.data('mid') || '';
        var cmntType = $item.data('type');
        var cmntIndex = $item.data('index');
        var cmntRindex = $item.data('rindex');
        var reqPara = {
            'channel': _this.conf.channel,
            'newsid': _this.conf.newsid,
            'parent': mid,
            'usertype': 'wap',
        };
        var reqCb = reqObj.request({
            url: _this.conf.agreeApi,
            data: reqPara,
            type: 'POST',
            dataType: 'json',
            timeout: 3000
        });

        // 点赞计数加一，切换到点赞后的样式，解除绑定的点击事件
        reqCb.success = function() {
            var imList = List();
            var newImList = List();

            imList = fromJS(_this.state[cmntType]);

            if (cmntRindex != undefined) {
                newImList = imList.updateIn([cmntIndex, 'replyList', cmntRindex, 'agreeNum'], val => parseInt(val)+1)
                                  .setIn([cmntIndex, 'replyList', cmntRindex, 'hadAgreed'], true);
            }
            else {
                newImList = imList.updateIn([cmntIndex, 'agreeNum'], val => parseInt(val)+1)
                                  .setIn([cmntIndex, 'hadAgreed'], true);
            }

            _this.setState(() => {
                let newState = {};
                newState[cmntType] = newImList.toJS();
                return newState;
            });

            $target.find('i').addClass('praise__icon--red').removeClass('praise__icon--gray');
        };
    }

    _loadMore() {
        let $container = $('.layout__cmnts');
        if (!this.props.isShow || !$container.length || this.state.isGetAll || this.state.requesting) {
            return;
        }

        let bottomPos = $(window).scrollTop() + window.innerHeight;
        let pageHeight = $container.offset().top + $container.height();
        let loadingHeight = $('.cmnts__loading').height();

        if (pageHeight-bottomPos-loadingHeight < 10) {
            // SUDA PV 统计
            let sudaUrl = window.location.href.split('/comments')[0];
            window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, sudaUrl + '/comments#!?loadmore=1');

            this._getData({
                url: this.conf.getCmntsApi,
                page: this.state.nextPage
            });
        }
    }

    _showCmntsPopup(placeholder) {
        const { showCmntsPopup } = this.props;
        
        if (cookieUtil.getCookie('CMNT_CHECKBOX_WEIBO') === '1') {
            this.refs['checkbox_weibo'].checked = true;
        }

        // 获取上次未发布的评论
        if (window.localStorage && window.localStorage.getItem(this.conf.newsid)) {
            this.refs['cmnts_textarea'].value = window.localStorage.getItem(this.conf.newsid);
        }

        $('.cmnts__input').attr('placeholder', placeholder);

        this._handleCmntsInput();

        showCmntsPopup();
    }

    _handleLogin() {
        var oLogin = (typeof(window.WapLogin) == 'function') ? (new window.WapLogin()) : this;

        oLogin.login(false, function() { 
            window.location.reload();
        });

        $('#ST_outLogin_mask').on('touchstart touchmove touchend', function(e) {
            e.preventDefault();
        });
    }

    _handleCmntsReply(e) {
        if (!window.checkLogin()) {
            this._handleLogin();
            return;
        }

        let _this = this;
        let $target = $(e.currentTarget);
        let $replyTo = $target.parents('[class|="item"]');
        let placeholder = '写看法';

        const { userInfo } = this.props;
        let userName = userInfo.nick || userInfo.uname || userInfo.uid;
        let userPic = userInfo.userface || _this.conf.defaultFace;

        let replyInfo = {
            'type': '',     // 评论类型（latestCmnts/hotCmnts）
            'index': null,  // 评论话题的评论索引
            'rindex': null, // 回复个人的评论索引
            'data': {},     // 评论数据
        };

        if ($replyTo.length) {
            // 回复个人：二级评论
            placeholder = `回复${$replyTo.data('username')}：`;
            replyInfo = {
                'type': $replyTo.data('type'),
                'index': $replyTo.data('index'),
                'rindex': 0,
                'data': {
                    'agreeNum': '0',
                    'content': '',
                    'hadAgreed': false,
                    'level': String($replyTo.data('level')+1),
                    'mid': null,
                    'pmid': $replyTo.data('mid'),
                    'time': '刚刚',
                    'userName': userName,
                    'userPic': userPic
                }
            };
        }
        else {
            // 评论话题：一级评论
            replyInfo = {
                'type': 'latestCmnts',
                'index': 0,
                'rindex': null,
                'data': {
                    'agreeNum': '0',
                    'content': '',
                    'hadAgreed': false,
                    'isGetAllReplies': false,
                    'mid': null,
                    'replyList': [],
                    'replyTotal': 0,
                    'time': '刚刚',
                    'userName': userName,
                    'userPic': userPic
                }
            };
        }

        this.setState({
            'replyInfo': replyInfo
        });

        this._showCmntsPopup(placeholder);
    }

    _hideCmntsPopup() {
        const { hideCmntsPopup } = this.props;
        hideCmntsPopup();

        this.refs['cmnts_textarea'].value = '';
        this.refs['cmnts_publish'].style['background-image'] = 'linear-gradient(-135deg, #BABABA 0%, #C8C8C8 100%)';
    }

    _cancelCmnts() {
        // 将评论存储到localStorage
        let content = this.refs['cmnts_textarea'].value;
        if (content && window.localStorage) {
            window.localStorage.setItem(this.conf.newsid, content);
        }

        this._hideCmntsPopup();
    }

    _getAllReplies(e) {
        let $target = $(e.target);
        let mid = $target.parents("[data-role|='cmntItem']").data('mid');

        this._getReplyData({
            url: this.conf.getRepliesApi,
            mid: mid,
            isShowAll: true
        });

        // SUDA PV 统计
        let sudaUrl = window.location.href.split('/comments')[0];
        window.SUDA.log(window.sudaLogExt1, window.sudaLogExt2, sudaUrl + '/comments#!?loadreply=1');
    }

    _publishCmnts() {
        let _this = this;

        if (!_this.conf.channel || !_this.conf.newsid) {
            return;
        }

        let content = this.refs['cmnts_textarea'].value;
        if (content) {
            _this.setState({'status': 2});

            let rqPara = {
                'channel': _this.conf.channel,
                'newsid': _this.conf.newsid,
                'content': content,
                'ie': 'utf-8',
                'oe': 'utf-8',
                'usertype': 'wap',
            };

            // 检查转发到微博的勾选状态
            if (_this.refs['checkbox_weibo'].checked) {
                Object.assign(rqPara, {
                    'ispost': 1,
                    'share_url': window.location.href.split('comments')[0]
                });

                // 保存转发到微博的勾选状态到cookie
                cookieUtil.setCookie({
                    key: 'CMNT_CHECKBOX_WEIBO',
                    value: '1'
                });
            }

            if (_this.state.replyInfo.data.pmid) {
                Object.assign(rqPara, {
                    'parent': _this.state.replyInfo.data.pmid
                });
            }

            let reqCb = reqObj.request({
                url: _this.conf.submitCmntApi,
                data: rqPara,
                type: 'POST',
                dataType: 'json',
                timeout: 3000
            });

            reqCb.error = function() {
                // 评论失败提示
                _this.setState({'status': -1});

                // 隐藏评论失败提示
                setTimeout(function() {
                    _this.setState({'status': -10});
                }, 2000);

                if (!_this.props.isShow) {
                    _this.props.showCmnts();
                }
            };

            reqCb.success = function() {
                _this._hideCmntsPopup();

                // 评论成功提示
                _this.setState({'status': 1});

                // 显示临时评论信息到最新评论或热门评论的回复
                _this.state.replyInfo.data['content'] = content;
                let cmntType = _this.state.replyInfo.type;
                let cmntIndex = _this.state.replyInfo.index;
                let cmntRindex = _this.state.replyInfo.rindex;
                let cmntData = _this.state.replyInfo.data;
                let imList = List();
                let newImList = List();

                imList = fromJS(_this.state[cmntType]);
                if (cmntRindex != null) {
                    newImList = imList.updateIn([cmntIndex, 'replyList'], (rList) => {
                        return rList.insert(cmntRindex, cmntData);
                    });
                }
                else {
                    newImList = imList.insert(cmntIndex, cmntData);
                }
                _this.setState(() => {
                    let newState = {};
                    newState[cmntType] = newImList.toJS();
                    return newState;
                });

                // 更新评论总数
                let totalCmnts = _this.state.totalCount;
                if (typeof(totalCmnts) == 'number') {
                    if (totalCmnts < 9999) {
                        totalCmnts = totalCmnts + 1;
                    }
                    else if (totalCmnts == 9999){
                        totalCmnts = '1.0万';
                    }

                    _this.setState({
                        'totalCount': totalCmnts
                    });
                    _this.props.setTotalCmnts(totalCmnts);
                }

                // 隐藏成功提示
                setTimeout(function() {
                    _this.setState({'status': 10});
                }, 2000);

                if (!_this.props.isShow) {
                    _this.props.showCmnts();
                }

                // 删除localStorage中缓存的评论内容
                if (window.localStorage && window.localStorage.getItem(_this.conf.newsid)) {
                    window.localStorage.removeItem(_this.conf.newsid);
                }

                // 隐藏虚拟键盘
                _this.refs['cmnts_textarea'].blur();
            };
        }
    }

    _handleCmntsInput() {
        var target = this.refs['cmnts_textarea'];
        var publishBtn = this.refs['cmnts_publish'];

        if (target.value === '') {
            target.style.color = '#c8c8c8';
            publishBtn.style['background-image'] = 'linear-gradient(-135deg, #BABABA 0%, #C8C8C8 100%)';
        }
        else {
            target.style.color = '#666666';
            publishBtn.style['background-image'] = 'linear-gradient(-135deg, #FF834B 0%, #FF9E4D 100%)';
        }
    }

    _handleCmntsFrameClick(e) {
        const { isShow } = this.props;

        // SUDA 用户行为统计
        if (isShow) {
            window.suda_count({
                'type': 'click',
                'name': 'comment_box_d_1',
                'title': '点击评论页的评论框',
                'index': 0
            });
        }
        else {
            window.suda_count({
                'type': 'click',
                'name': 'comment_box_f_1',
                'title': '点击观点页的评论框',
                'index': 0
            });
        }

        this._handleCmntsReply(e);
    }

    render() {
        let _this = this;
        const { isShow, isShowPopup, isGetAllCards } = this.props;
        let cmntsClass = classNames({
            'layout__cmnts': true,
            'hide': !(isShow || (!isShow && isGetAllCards))
        });
        let emptyClass = classNames({
            'cmnts__empty': true,
            'hide': !(isShow && !this.state.hotCmnts.length && !this.state.latestCmnts.length)
        });
        let popupClass = classNames({
            'popup__cmnts': true,
            'hide': !isShowPopup
        });
        let hotClass = classNames({
            'cmnts__ctner': true,
            'hide': !(isShow && this.state.hotCmnts.length)
        });
        let latestClass = classNames({
            'cmnts__ctner': true,
            'hide': !(isShow && this.state.latestCmnts.length)
        });
        let nomoreClass = classNames({
            'cmnts__nomore': true,
            'hide': !(isShow && this.state.isGetAll && this.state.latestCmnts.length)
        });
        let cmntsHTML = {
            'latestCmnts': [],
            'hotCmnts': [],
        };
        let statusSuccessClass = classNames({
            'cmnts__status--appear': this.state.status == 1,
            'cmnts__status--disappear': this.state.status == 10,
            'hide': this.state.status !== 1 && this.state.status !== 10
        });
        let statusFailureClass = classNames({
            'cmnts__status--appear': this.state.status == -1,
            'cmnts__status--disappear': this.state.status == -10,
            'hide': this.state.status !== -1 && this.state.status !== -10
        });
        let statusPublishingClass = classNames({
            'cmnts__status--appear': true,
            'hide': this.state.status !== 2
        });
        let statusLoadingClass = classNames({
            'cmnts__loading': true,
            'hide': !(isShow && !this.state.isGetAll) || !this.state.latestCmnts.length
            // 'hide': !(isShow && this.state.loading)
        });

        // 渲染评论数据
        for (let cmntTypeKey in cmntsHTML) {
            if (cmntsHTML.hasOwnProperty(cmntTypeKey)) {
                cmntsHTML[cmntTypeKey] = this.state[cmntTypeKey].map((item, index) => {
                    let itemClass = classNames({
                        'item': index!==0,
                        'item--first': index===0
                    });
                    let replyListClass = classNames({
                        'level2__ctner': true,
                        'hide': !item.replyList.length
                    });
                    let agreeNum = item.agreeNum === '0' ? '赞' : item.agreeNum;
                    let replyCmnts = (cmnt) => {
                        // 如果不是显示全部回复，则显示前LIMIT_REPLYSIZE条
                        if (!cmnt.isGetAllReplies) {
                            cmnt.replyList = cmnt.replyList.slice(0, _this.LIMIT_REPLYSIZE);
                        }

                        return cmnt.replyList.map((rItem, rIndex) => {
                            let rAgreeNum = rItem.agreeNum === '0' ? '赞' : rItem.agreeNum;
                            let showmoreClass = classNames({
                                'replies__showmore': true,
                                'hide': (cmnt.replyTotal <= _this.LIMIT_REPLYSIZE) || (_this.LIMIT_REPLYSIZE-1 !== rIndex) || cmnt.isGetAllReplies
                            });

                            let rContent = <a className="content" onClick={ !rItem.mid ? null : _this._handleCmntsReply.bind(this) }>{rItem.content}</a>;
                            if (rItem.level > 1 && (rItem.replyTo || _this.refs[rItem.pmid])) {
                                let replyName = rItem.replyTo || _this.refs[rItem.pmid].dataset['username'];
                                rContent = <a className="content" onClick={ !rItem.mid ? null : _this._handleCmntsReply.bind(this) }>{'回复'}<span className="content__rname">{'@' + replyName}</span>{'：' + rItem.content}</a>;
                            }

                            return (
                                <div key={rItem.mid ? rItem.mid : rIndex} data-role="replyItem" data-mid={rItem.mid} >
                                    <div className="item"
                                         ref={rItem.mid}
                                         data-username={rItem.userName}
                                         data-mid={rItem.mid} 
                                         data-pmid={rItem.pmid}
                                         data-type={cmntTypeKey}
                                         data-index={index}
                                         data-rindex={rIndex}
                                         data-level={rItem.level}
                                         data-sudaclick="comment_reply_1"
                                        >
                                        <a className="info">
                                            <img className="portrait" src={rItem.userPic} />
                                            <span className="nickname">{rItem.userName}</span>
                                            <span className="time">{rItem.time}</span>
                                        </a>
                                        {rContent}
                                        <div className="action">
                                            <a className="praise" onClick={ (!rItem.mid || rItem.hadAgreed) ? null : _this._handleAgree.bind(this) } >
                                                <i className="praise__icon--gray"></i>
                                                <span className="praise__num">{rAgreeNum}</span>
                                            </a>
                                            <a className="reply" onClick={ !rItem.mid ? null : _this._handleCmntsReply.bind(this) }>
                                                <i className="reply__icon"></i>
                                                <span className="reply__txt">回复</span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className={showmoreClass}
                                         onClick={_this._getAllReplies.bind(this)}
                                         data-sudaclick="comment_reply_more_1">查看其它{cmnt.replyTotal - _this.LIMIT_REPLYSIZE}条回复</div>
                                </div>
                            );
                        });
                    };

                    return (
                        <div key={item.mid ? item.mid : index} data-role="cmntItem" data-mid={item.mid} >
                            <div className={itemClass}
                                 ref={item.mid}
                                 data-username={item.userName}
                                 data-mid={item.mid}
                                 data-type={cmntTypeKey}
                                 data-index={index}
                                 data-rindex={null}
                                 data-level={0}
                                 data-sudaclick="comment_card_1"
                                >
                                <a className="info">
                                    <img className="portrait" src={item.userPic} />
                                    <span className="nickname">{item.userName}</span>
                                    <span className="time">{item.time}</span>
                                </a>
                                <a className="content" onClick={ !item.mid ? null : _this._handleCmntsReply.bind(this) }>{item.content}</a>
                                <div className="action">
                                    <a className="praise" onClick={ (!item.mid || item.hadAgreed) ? null : _this._handleAgree.bind(this) } >
                                        <i className="praise__icon--gray"></i>
                                        <span className="praise__num">{agreeNum}</span>
                                    </a>
                                    <a className="reply" onClick={ !item.mid ? null : _this._handleCmntsReply.bind(this) }>
                                        <i className="reply__icon"></i>
                                        <span className="reply__txt">回复</span>
                                    </a>
                                </div>
                            </div>
                            <div className={replyListClass}>
                                {replyCmnts(item)}
                            </div>
                        </div>
                    );
                });
            }
        }

        return (
            <div className={cmntsClass}>
                <div className="cmnts__init">
                    <div className="cmnts__guide">
                        <div className="cmnts__txt-ctner" onClick={this._handleCmntsFrameClick.bind(this)}>
                            <p className="cmnts__txt">嘿！这个话题你怎么看呢？快来发表观点吧！</p>
                        </div>
                    </div>

                    <div className={hotClass}>
                        <div className="title">{'精彩评论（' + this.state.hotCmnts.length + '）'}</div>
                        <div className="level1__ctner">
                            {cmntsHTML['hotCmnts']}
                        </div>
                    </div>
                    <div className={latestClass}>
                        <div className="title">{'最新评论（' + this.state.totalCount + '）'}</div>
                        <div className="level1__ctner">
                            {cmntsHTML['latestCmnts']}
                        </div>
                    </div>

                    <div className={nomoreClass}>没有更多评论啦</div>
                    <div className={emptyClass}>
                        <div className="empty__bg"></div>
                        <p className="empty__txt">还没有人发表观点</p>
                    </div>
                </div>
                <div className={popupClass} data-sudaclick="comment_input_1">
                    <div className="cmnts__masklayer"></div>
                    <div className="cmnts__input-ctner">
                        <div className="cmnts__actions">
                            <a className="cmnts__weibo">
                                <input ref="checkbox_weibo" id="checkbox_weibo" type="checkbox" className="weibo__checkbox" />
                                <label htmlFor="checkbox_weibo" className="weibo__label">同时转发到微博</label>
                            </a>
                            <a className="cmnts__cancel" onClick={this._cancelCmnts.bind(this)}>取消</a>
                            <a ref="cmnts_publish" className="cmnts__publish" onClick={this._publishCmnts.bind(this)}>发布</a>
                        </div>
                    </div>
                    <a>
                        <textarea 
                            className="cmnts__input" 
                            ref="cmnts_textarea"
                            placeholder="嘿！这个话题你怎么看呢？快来发表观点吧！"
                            onInput={this._handleCmntsInput.bind(this)}
                        ></textarea>
                    </a>
                </div>
                <div className={statusPublishingClass}>发布中</div>
                <div className={statusSuccessClass}>发布成功</div>
                <div className={statusFailureClass}>发布失败</div>
                <div className={statusLoadingClass}></div>
            </div>
        );
    }
}

Comment.propTypes = {
    newsId: PropTypes.string,
    userInfo: PropTypes.object,
    isShow: PropTypes.bool,
    isGetAllCards: PropTypes.bool,
    isShowPopup: PropTypes.bool,
    isShowEmptyPrompt: PropTypes.bool,
    showCmntsPopup: PropTypes.func,
    hideCmntsPopup: PropTypes.func,
    setTotalCmnts: PropTypes.func,
    showCmnts: PropTypes.func,
};

Comment.defaultProps = {
    newsId: '',
    userInfo: {
        islogin: 0,
        nick: '',
        portrait_url: '',
        return_url: '',
        uid: '',
        uname: '',
        userface: ''
    },
    isShow: false,
    isGetAllCards: false,
    isShowPopup: false,
    isShowEmptyPrompt: false,
    showCmntsPopup: () => {},
    hideCmntsPopup: () => {},
    setTotalCmnts: () => {},
    showCmnts: () => {},
};

export default Comment;
