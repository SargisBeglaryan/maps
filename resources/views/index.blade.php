@extends('layout.default')

@section('keywords'){{ 'Some kewords'}}@endsection

@section('description'){{'Some description'}}@endsection

<div class="container">
	<h1 class="homePageTitle">Location Information</h1>
	<button type="button" class="add-new btn btn-primary" data-toggle="modal" data-target="#mapModal">Add New</button>
	<table class="locations-table table table-striped">
    <thead>
      <tr>
        <th>Address</th>
        <th>Area</th>
        <th>Points Location</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>

<div id="mapModal" class="modal fade" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="row">
        	<div class="col-md-8">
        		<div id="map"></div>
        	</div>
        	<div class="col-md-4">
        		<div class="mapDetailsContent">
      				<h4 class="dialog-title">Map Selection tools</h4>
      				<p class="dialog-info-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
      				<div class="form-group">
      					<input  id="pac-input" type="text" class="form-control">
      				</div>
              <div class="form-group">
        				<button class="confirm-button btn btn-primary disabled" disabled>Confirm Selection</button>
              </div>
              <div class="form-group">
        				<button class="reset-button btn btn-danger disabled" disabled>Reset Selection</button>
              </div>
      			</div>
        	</div>
        </div>
      </div>
    </div>

  </div>


@section('content')
  <script src="{{asset('js/maps.js')}}"></script>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBgBy_DHNpUMeEMYPlN7hrtpzCNZQ8sFDI&libraries=places,drawing&callback=initMap"
        async defer></script>

@endsection
