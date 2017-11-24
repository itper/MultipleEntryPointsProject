import React , { PropTypes , Component } from 'react';
import CommonLink from './list/CommonLink';
import ListItem1 from './ListItem1';

class List extends Component {
    render() {
        const category = this.props.category;
        const infoList = this.props.list.map((info, i) => {
            return <ListItem1 key={info.newsid} info={info} category={category}></ListItem1>;
        });

        return (
            <section className="related_info">
                <p className="related_info_title">相关资讯</p>
                <ul className="related_info_list">
                    {infoList}
                </ul>
                <CommonLink to={'/'+category}><p className="related_info_more_box"><span className="related_info_more">查看更多资讯</span></p></CommonLink>
            </section>
        );
    }
}

List.PropTypes = {
    list : PropTypes.array.isRequired,
    category : PropTypes.string.isRequired
};

export default List;