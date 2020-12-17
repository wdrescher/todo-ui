import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() text: string;
  @Input() isLoading: boolean = false;
  @Input() white: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
