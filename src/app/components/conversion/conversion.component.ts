import { NgFor, NgIf, DecimalPipe } from '@angular/common'
import { Component, effect, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatProgressBarModule } from '@angular/material/progress-bar'

import { NgxDropzoneModule } from 'ngx-dropzone'
import { cloneDeep } from 'lodash'

import { Conversion } from '../../utils/conversion'
import { TimestampPreviewPipe } from '../../pipes/timestamp-preview.pipe'

@Component({
  selector: 'hc-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf, NgFor, DecimalPipe,
    TimestampPreviewPipe,
    NgxDropzoneModule,
    MatIconModule, MatButtonModule, MatSnackBarModule, MatProgressBarModule
  ]
})
export class ConversionComponent {
  images: File[] = []
  convertedImages: File[] = []
  blobs: Blob[] = []

  convertState = {
    pending: false,
    progress: 0,
    time: {
      start: 0,
      end: 0
    }
  }

  private conversion = new Conversion()

  constructor (private readonly cdr: ChangeDetectorRef, private readonly snackBar: MatSnackBar) {
    effect(() => {
      this.convertState.progress = this.conversion.progress()
      this.cdr.markForCheck()
    })
  }

  imagesTrack (i: number, f: File): string {
    return `${i}_${f.name}`
  }

  onFilesSelected (event: { addedFiles: File[] }): void {
    this.images = cloneDeep(event.addedFiles)
    this.cdr.detectChanges()
  }

  async convert (): Promise<void> {
    this.snackBar.open('Convertion started', '', { duration: 3000 })
    this.convertState.time.start = new Date().getTime()
    this.convertState.pending = true
    this.blobs = await this.conversion.convertHeicToType(this.images)
    for (let i = 0; i < this.blobs.length; i++) this.convertedImages.push(new File([this.blobs[i]], this.images[i].name))
    this.convertState.pending = false
    this.convertState.time.end = new Date().getTime()
    this.cdr.detectChanges()
  }

  download (): void {
    this.snackBar.open('Archive download starts', '', { duration: 3000 })
    const l = this.blobs.length
    const files: { name: string, blob: Blob }[] = []
    for (let i = 0; i < l; i++) files.push({ name: this.images[i].name, blob: this.blobs[i] })
    this.conversion.downloadZip(files)
    this.cdr.detectChanges()
  }

  clear (): void {
    this.images = []
    this.convertedImages = []
    this.convertState = {
      pending: false,
      progress: 0,
      time: { start: 0, end: 0 }
    }
    this.conversion.resetProgress()
    this.cdr.detectChanges()
  }
}
