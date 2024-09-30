import { NgFor, NgIf, DecimalPipe } from '@angular/common'
import { Component, effect } from '@angular/core'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatProgressBarModule } from '@angular/material/progress-bar'

import { NgxDropzoneModule } from 'ngx-dropzone'
import { cloneDeep } from 'lodash'

import { Conversion } from '../../utils/conversion'

@Component({
  selector: 'hc-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss'],
  standalone: true,
  imports: [
    NgIf, NgFor, DecimalPipe,
    NgxDropzoneModule,
    MatIconModule, MatButtonModule, MatSnackBarModule, MatProgressBarModule
  ]
})
export class ConversionComponent {
  images: File[] = []
  convertedImages: File[] = []
  blobs: Blob[] = []

  conversionInProgress = false
  progress = 0

  private conversion = new Conversion()

  constructor (private readonly snackBar: MatSnackBar) {
    effect(() => { this.progress = this.conversion.progress() })
  }

  onFilesSelected (event: { addedFiles: File[] }): void {
    this.images = cloneDeep(event.addedFiles)
  }

  async convert (): Promise<void> {
    this.snackBar.open('Convertion started', '', { duration: 3000 })
    this.conversionInProgress = true
    this.blobs = await this.conversion.convertHeicToType(this.images)
    for (let i = 0; i < this.blobs.length; i++) this.convertedImages.push(new File([this.blobs[i]], this.images[i].name))
    this.conversionInProgress = false
  }

  download (): void {
    this.snackBar.open('Archive download starts', '', { duration: 3000 })
    const l = this.blobs.length
    const files: { name: string, blob: Blob }[] = []
    for (let i = 0; i < l; i++) files.push({ name: this.images[i].name, blob: this.blobs[i] })
    this.conversion.downloadZip(files)
  }

  clear (): void {
    this.images = []
    this.convertedImages = []
    this.conversionInProgress = false
    this.conversion.resetProgress()
  }
}
