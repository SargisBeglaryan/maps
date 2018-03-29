@extends('layout.default')

@section('keywords'){{ 'Some kewords'}}@endsection

@section('description'){{'Some description'}}@endsection

<div class="container">
	<h1 class="homePageTitle">Location Information</h1>
	<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#mapModal">Add New</button>
	<table class="table table-striped">
    <thead>
      <tr>
      	<th>Number</th>
        <th>Firstname</th>
        <th>Lastname</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>

<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
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
					<input  id="autocomplete" type="search" class="form-control" onFocus="geolocate()">
				</div>
				<button class="confirm-button" mat-raised-button color="warn">Confirm Selection</button>
				<button class="reset-button" mat-raised-button color="primary">Reset Selection</button>
			</div>
        	</div>
        </div>
      </div>
    </div>

  </div>


@section('content')
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBgBy_DHNpUMeEMYPlN7hrtpzCNZQ8sFDI&libraries=drawling&callback=initAutocomplete"
        async defer></script>

@endsection
