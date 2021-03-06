import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {View, ActivityIndicator, StyleSheet, FlatList} from 'react-native';
import {ThemedView, Header} from 'src/components';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import VendorItem from 'src/containers/VendorItem';
import VendorItemLoading from 'src/containers/VendorItem/Loading';

import {getVendors} from 'src/modules/vendor/service';
import {locationSelector} from 'src/modules/auth/selectors';

import {fetchVendorDetailSuccess} from 'src/modules/vendor/actions';
import {margin, padding} from 'src/components/config/spacing';
import {mainStack} from 'src/config/navigator';

class Stores extends React.Component {
  state = {
    data: [],
    page: 1,
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  fetchData = async () => {
    try {
      const {location} = this.props;
      const {page} = this.state;
      const query = {
        paged: page,
        per_page: 10,
        wcfmmp_radius_range: 50,
        wcfmmp_radius_lat: location.latitude,
        wcfmmp_radius_lng: location.longitude,
      };
      // eslint-disable-next-line no-undef
      this.abortController = new AbortController();
      const data = await getVendors(query, {
        signal: this.abortController.signal,
      });
      if (data.length <= 10 && data.length > 0) {
        this.setState(prevState => ({
          data: page === 1 ? Array.from(data) : [...prevState.data, ...data],
          loading: false,
          loadingMore: data.length === 10,
          refreshing: false,
        }));
      } else {
        this.setState({
          loadingMore: false,
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        error,
        loading: false,
        loadingMore: false,
      });
    }
  };

  handleLoadMore = () => {
    const {loadingMore} = this.state;

    if (loadingMore) {
      this.setState(
        (prevState, nextProps) => ({
          page: prevState.page + 1,
          loadingMore: true,
        }),
        () => {
          this.fetchData();
        },
      );
    }
  };

  renderFooter = () => {
    if (!this.state.loadingMore) {
      return <View style={styles.footer} />;
    }

    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.fetchData();
      },
    );
  };
  goStoreDetail = data => {
    const {saveVendor, navigation} = this.props;
    saveVendor(data);
    navigation.navigate(mainStack.store_detail);
  };

  render() {
    const {t} = this.props;
    const {data, loading, refreshing} = this.state;
    const dataLoading = new Array(6).fill(0);
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_stores')} />}
        />
        {!loading ? (
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => `${item.id}`}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.list}
            renderItem={({item}) => <VendorItem item={item} type="three" />}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            ListFooterComponent={this.renderFooter()}
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
          />
        ) : (
          <FlatList
            data={dataLoading}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => `${index}`}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.list}
            renderItem={({_}) => <VendorItemLoading type="three" />}
          />
        )}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: padding.large,
  },
  separator: {
    height: margin.base,
  },
  viewLoading: {
    marginVertical: margin.large,
  },
  footer: {
    marginBottom: margin.large,
  },
  footerLoading: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  location: locationSelector(state),
});

const mapDispatchToProps = {
  saveVendor: fetchVendorDetailSuccess,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Stores));
