/**
 * Author: zhiyou
 * Date: 2017/05/17
 * Description: 图片懒加载。
 */
module.exports = {
    lazyloadPic: function ($scope, containerClass) {
        var picLoading = true;

        if (!picLoading || $scope.is(':hidden')) {
            return;
        }

        picLoading = false;
        setTimeout(() => {
            picLoading = true;
        }, 100);

        var scrollTopPos = $(window).scrollTop() + $(window).height();
        var picElements = $scope.find(containerClass);

        picElements.forEach((item) => {
            if (!item.imgOnload && ($(item).offset().top < scrollTopPos)) {
                var oImage = new Image();
                oImage.src = $(item).data('imgurl');
                oImage.onload = () => {
                    item.imgOnload = true;
                    $(item).css({
                        'background-image': 'url(' + $(item).data('imgurl') + ')',
                        'background-size': '100% 100%'
                    });
                };
            }
        });
    },
    init: function ($scope, containerClass) {
        var _this = this;

        _this.lazyloadPic($scope, containerClass);
        $(window).on('scroll', _this.lazyloadPic.bind(_this, $scope, containerClass));
    }
};
