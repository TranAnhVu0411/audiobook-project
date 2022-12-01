const backgroundColorObject = {
    'Kinh doanh': '#FFCEA3',
    'Kỹ năng sống': '#C0F5A2',
    'Tài chính': '#FBE692',
    'Marketing': '#78EBA8',
    'Tôn giáo': '#ECB4F5',
    'Tâm lý': '#8CEBDB',
    'Hạnh phúc': '#FAB4D7',
    'Sống khoẻ': '#9EE1FF',
    'Thiếu nhi': '#FEB1B1',
    'Tiểu thuyết': '#CAC2FF'
};

const borderColorObject = {
    'Kinh doanh': '#FAA255',
    'Kỹ năng sống': '#9EE67A',
    'Tài chính': '#F0C348',
    'Marketing': '#50D989',
    'Tôn giáo': '#E27CF1',
    'Tâm lý': '#25D9B9',
    'Hạnh phúc': '#F562AC',
    'Sống khoẻ': '#66C6F2',
    'Thiếu nhi': '#EB5959',
    'Tiểu thuyết': '#7F7CE6'
};
export const getBackgroundColor = (id) => {
    return backgroundColorObject[id];
};

export const getBorderColor = (id) => {
    return borderColorObject[id];
};