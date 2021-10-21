export class Utils {
    public static convertDateTimeToString(date: Date): string {
        if (!date) {
          return;
        }
        const newDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          date.getMilliseconds()
        );
        return newDate.toISOString();
    }

    public static callDuration(time) {
        const hours   = Math.floor(time / 3600);
        let minutes: any = Math.floor((time - (hours * 3600)) / 60);
        const seconds = time - (hours * 3600) - (minutes * 60);
        let duration = '';
        if (hours !== 0) {
          duration = hours + 'ó' + ' : ';
        }
        if (minutes !== 0 || duration !== '') {
          minutes = (minutes < 10 && duration !== '') ? '0' + minutes : String(minutes);
          duration += minutes + 'p' + ' : ';
        }
        if (duration === '') {
          duration = seconds + 'mp';
        } else {
          duration += (seconds < 10) ? '0' + seconds + 'mp' : String(seconds) + 'mp';
        }
        return duration;
    }
}
