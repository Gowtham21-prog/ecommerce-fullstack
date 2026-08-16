package com.fieldingvane.ecommerce.service;

import com.fieldingvane.ecommerce.dto.CategoryDto;
import com.fieldingvane.ecommerce.entity.Category;
import com.fieldingvane.ecommerce.exception.ResourceNotFoundException;
import com.fieldingvane.ecommerce.mapper.EntityMapper;
import com.fieldingvane.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final EntityMapper mapper;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(mapper::toCategoryDto)
                .toList();
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return mapper.toCategoryDto(category);
    }

    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return mapper.toCategoryDto(category);
    }
}
