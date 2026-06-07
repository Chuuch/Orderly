package com.chuch.Orderly.domain.menu.mapper;

import com.chuch.Orderly.domain.menu.dto.MenuItemResponse;
import com.chuch.Orderly.domain.menu.dto.MenuResponse;
import com.chuch.Orderly.domain.menu.entity.Menu;
import com.chuch.Orderly.domain.menu.entity.MenuItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MenuMapper {
    @Mapping(target = "items", source = "items")
    MenuResponse toResponse(Menu menu);

    @Mapping(target = "menuId", source = "menu.id")
    MenuItemResponse toMenuItemResponse(MenuItem menuItem);
}
