import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'timestampPreview',
  standalone: true
})
export class TimestampPreviewPipe implements PipeTransform {
  transform (ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    let result = ''

    if (hours > 0) result += `${hours}h`
    if (minutes > 0 || hours > 0) result += `${minutes}m `
    result += `${seconds}s`

    return result.trimStart().trimEnd()
  }
}
