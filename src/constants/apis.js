/**
 * Author: zhiyou
 * Date: 2017/11/22
 * Description: 话题相关后端接口。
 */
const API_PREFIX = "//xiaoyang7.topic.sina.cn/api/";

export default {
    "TOPIC_LIST": API_PREFIX + "news/topic_list",
    "TOPIC_DETAIL": API_PREFIX + "news/topic_detail",
    "TOPIC_DETAIL_MORE": API_PREFIX + "news/cdetails_bynum",
    "TOPIC_ATTENTION": API_PREFIX + "news/attention",
    "CARD_PRAISE": API_PREFIX + "cards/praise",
    "CARD_DETAIL": API_PREFIX + "cards/detail",
    "CARD_VOTE": API_PREFIX + "survey/vote",
    "MY_CARD_LIST": API_PREFIX + "news/cardslist_byuid",
    "MY_TOPIC_SUM": API_PREFIX + "news/focusum_byuid",
};
