import Http from '../../utils/http';

export default class MonitorHistroyService {
  getMonitorList() {
    return Http.get('/fdd/shortMonitor/getHistoryList.json')
      .then(resp => Promise.resolve(resp.data || []))
      .then(monitorList => {
        return monitorList.map(item => {
          item.title = `${item.cityName}(${item.locationName || '全城'})`;
          item.monitorDateText = `${(item.startTime || item.createTime).substr(
            0,
            10
          )}至${item.endTime.substr(0, 10)}`;
          item.dateText = `入住: ${item.beginDate.substr(
            0,
            10
          )}  离开: ${item.endDate.substr(0, 10)}`;
          return item;
        });
      });
  }

  removeHistoryMonitor(id) {
    return Http.post('/fdd/shortMonitor/deleteMonitor.json', { id }).then(_ =>
      this.getMonitorList()
    );
  }
}
