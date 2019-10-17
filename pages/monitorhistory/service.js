import Http from '../../utils/http';

export default class MonitorHistroyService {
  getMonitorList() {
    return Http.get('/fdd/shortMonitor/getHistoryList.json')
      .then(resp => Promise.resolve(resp.data || []))
      .then(monitorList => {
        return monitorList.filter(value => {
          monitorList.map(function (item) {
            item.title = `${item.cityName}(${item.locationName || '全城'})`;
            item.monitorDateText = item.startTime ? `监控时间:${(item.startTime).substr(
              0,
              10
            )}至${item.endTime.substr(0, 10)}` : '';
            item.dateText = `入住: ${item.beginDate.substr(
              5,
              5
            )}  离开: ${item.endDate.substr(5, 5)}`;
            return item;
          });
          if (value.startTime) {
            return true
          }
          
        });
      });
  }

  removeHistoryMonitor(id) {
    return Http.post('/fdd/shortMonitor/deleteMonitor.json', { id }).then(_ =>
      this.getMonitorList()
    );
  }
}
