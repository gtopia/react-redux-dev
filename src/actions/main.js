/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: 首页action。
 */
import actionTypes from '../constants/main';

export function showFav() {
    return {
        type: actionTypes.SHOW_FAV,
    };
}

export function closeFav() {
    return {
        type: actionTypes.CLOSE_FAV,
    };
}

export function showFavGuide() {
    return {
        type: actionTypes.SHOW_FAV_GUIDE,
    };
}

export function closeFavGuide() {
    return {
        type: actionTypes.CLOSE_FAV_GUIDE,
    };
}
