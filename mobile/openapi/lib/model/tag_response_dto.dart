//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TagResponseDto {
  /// Returns a new [TagResponseDto] instance.
  TagResponseDto({
    required this.createdAt,
    required this.id,
    required this.name,
    required this.path,
    required this.updatedAt,
  });

  DateTime createdAt;

  String id;

  String name;

  String path;

  DateTime updatedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is TagResponseDto &&
    other.createdAt == createdAt &&
    other.id == id &&
    other.name == name &&
    other.path == path &&
    other.updatedAt == updatedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (createdAt.hashCode) +
    (id.hashCode) +
    (name.hashCode) +
    (path.hashCode) +
    (updatedAt.hashCode);

  @override
  String toString() => 'TagResponseDto[createdAt=$createdAt, id=$id, name=$name, path=$path, updatedAt=$updatedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'createdAt'] = this.createdAt.toUtc().toIso8601String();
      json[r'id'] = this.id;
      json[r'name'] = this.name;
      json[r'path'] = this.path;
      json[r'updatedAt'] = this.updatedAt.toUtc().toIso8601String();
    return json;
  }

  /// Returns a new [TagResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TagResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return TagResponseDto(
        createdAt: mapDateTime(json, r'createdAt', r'')!,
        id: mapValueOfType<String>(json, r'id')!,
        name: mapValueOfType<String>(json, r'name')!,
        path: mapValueOfType<String>(json, r'path')!,
        updatedAt: mapDateTime(json, r'updatedAt', r'')!,
      );
    }
    return null;
  }

  static List<TagResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TagResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TagResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TagResponseDto> mapFromJson(dynamic json) {
    final map = <String, TagResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TagResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TagResponseDto-objects as value to a dart map
  static Map<String, List<TagResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<TagResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TagResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'createdAt',
    'id',
    'name',
    'path',
    'updatedAt',
  };
}

