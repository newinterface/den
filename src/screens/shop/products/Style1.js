import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import ProductItem from 'src/containers/ProductItem';
import ProductItemLoading from 'src/containers/ProductItem/Loading';
import {padding} from 'src/components/config/spacing';

const {width} = Dimensions.get('window');

class Style1 extends React.Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
  }
  renderFooter = () => {
    if (!this.props.loadingMore) {
      return <View style={styles.viewFooter} />;
    }

    return (
      <View style={[styles.viewFooter, styles.viewLoadingFooter]}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  onEndReachedComponent() {
    this.props.handleLoadMore();
    this.onEndReachedCalledDuringMomentum = false;
  }
  render() {
    const {loading, data, refreshing, handleRefresh} = this.props;
    const col = 2;
    const pad = padding.small;
    const wImage = (width - pad - 2 * padding.large) / col;
    if (loading) {
      const dataLoading = new Array(4).fill(0);
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          numColumns={col}
          columnWrapperStyle={styles.viewCol}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(_, index) => `${index}`}
          data={dataLoading}
          renderItem={_ => (
            <ProductItemLoading
              type="item3"
              width={wImage}
              containerStyle={{marginHorizontal: pad / 2}}
            />
          )}
        />
      );
    }
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        numColumns={col}
        columnWrapperStyle={styles.viewCol}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={item => `${item.id}`}
        data={data}
        renderItem={({item}) => (
          <ProductItem
            item={item}
            type="item3"
            width={wImage}
            containerStyle={{marginHorizontal: pad / 2}}
          />
        )}
        onMomentumScrollBegin={() =>
          (this.onEndReachedCalledDuringMomentum = false)
        }
        onEndReached={() => this.onEndReachedComponent()}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        ListFooterComponent={this.renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    );
  }
}

const styles = StyleSheet.create({
  viewCol: {
    paddingHorizontal: padding.large,
    marginHorizontal: -padding.small / 2,
  },
  separator: {
    height: 30,
  },
  viewFooter: {
    marginBottom: 26,
  },
  viewLoadingFooter: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
});

export default Style1;
